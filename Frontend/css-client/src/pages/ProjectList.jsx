import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { projectService } from '../services/projectService';
import { petitionService } from '../services/petitionService';

const ProjectList = () => {
  const {
    data: projects,
    loading,
    error,
    execute,
  } = useApi(projectService.getProjects);

  const {
    data: petitions,
    loading: loadingPetitions,
    error: errorPetitions,
    execute: executePetitions,
  } = useApi(petitionService.getMyPetitions);

  const [localPending, setLocalPending] = useState({});
  const [localPetitions, setLocalPetitions] = useState([]);
  // derive current student id from localStorage (same logic as petitionService)
  const getCurrentStudentId = () => {
    try {
      const raw = localStorage.getItem('dbUser');
      if (raw) {
        const db = JSON.parse(raw);
        return db._id || db.id || db.carnet || null;
      }
    } catch (e) {
      console.warn('Could not read dbUser from localStorage', e);
    }
    return null;
  };
  const studentId = getCurrentStudentId();
  const [petitionedMap, setPetitionedMap] = useState({});

  useEffect(() => {
    execute();
    executePetitions();
  }, [execute, executePetitions]);

  // Keep a local copy of petitions so we can update UI optimistically
  useEffect(() => {
    const list = Array.isArray(petitions) ? petitions : [];
    setLocalPetitions(list);

    // Build a map projectId -> petition for the current student
    try {
      const map = {};
      const sid = studentId;
      list.forEach((p) => {
        if (!p) return;

        // normalize student ids in petition
        const students = Array.isArray(p.students) ? p.students.map((s) => (s && s._id ? String(s._id) : String(s))) : [];
        const studentMatch = sid && students.includes(String(sid));

        if (!studentMatch) return;

        // extract project ids from petition in flexible shapes
        const projectIds = new Set();
        if (Array.isArray(p.projects)) {
          p.projects.forEach((proj) => {
            if (!proj) return;
            projectIds.add(proj._id ? String(proj._id) : String(proj));
          });
        }
        if (p.project) {
          const proj = p.project;
          projectIds.add(proj._id ? String(proj._id) : String(proj));
        }
        if (p.projectId) projectIds.add(String(p.projectId));

        projectIds.forEach((pid) => {
          // prefer latest petition if multiple
          map[pid] = p;
        });
      });

      setPetitionedMap(map);

      // set localPending for those projects so UI shows 'Pendiente'
      if (Object.keys(map).length > 0) {
        setLocalPending((prev) => {
          const copy = { ...prev };
          Object.keys(map).forEach((id) => {
            copy[id] = true;
          });
          return copy;
        });
      }
    } catch (e) {
      // ignore
    }
  }, [petitions, studentId]);

  if (loading || loadingPetitions) return <p>Cargando proyectos...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (errorPetitions) return <p>Error: {errorPetitions.message}</p>;

  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-5">Listado de Proyectos Activos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="py-2 px-4 border">Nombre del Proyecto</th>
              <th className="py-2 px-4 border">Descripción</th>
              <th className="py-2 px-4 border">Capacidad</th>
              <th className="py-2 px-4 border">Fecha de Inicio</th>
              <th className="py-2 px-4 border">Fecha de Finalización</th>
              <th className="py-2 px-4 border">Institución</th>
              <th className="py-2 px-4 border">Participantes</th>
              <th className="py-2 px-4 border">Estado Petición</th>
              <th className="py-2 px-4 border">Acción</th>
            </tr>
          </thead>
          <tbody>
            {projects?.length > 0 ? (
              projects.map((project) => {
                // prefer petition from petitionedMap for this project
                const petition = petitionedMap[project._id] || null;

                // Normalize petition display
                const isPendingLocal = !!localPending[project._id];
                const hasPetition = !!petition;

                const getPetitionDisplay = (p) => {
                  if (!p || !p.status) return { label: 'No solicitado', color: 'gray' };
                  const s = String(p.status).toLowerCase();
                  if (s.includes('pend') || s === 'pending' || s === 'pendiente')
                    return { label: 'Pendiente', color: 'yellow' };
                  if (s.includes('approve') || s.includes('aprov') || s === 'approved' || s === 'aprobado')
                    return { label: 'Aprobado', color: 'green', date: p.approvedAt };
                  if (s.includes('reject') || s.includes('rechaz') || s === 'rejected' || s === 'rechazado')
                    return { label: 'Rechazado', color: 'red', reason: p.rejectionReason };
                  return { label: String(p.status), color: 'gray' };
                };

                const petitionDisplay = getPetitionDisplay(petition);

                const onInscribirme = async () => {
                  try {
                    // optimistic: mark as pending immediately
                    setLocalPending((prev) => ({
                      ...prev,
                      [project._id]: true,
                    }));
                    const res = await petitionService.createPetition(project._id);
                    // Try to extract created petition from known response shapes
                    const created = res && res.data ? res.data : res;
                    if (created) {
                      setLocalPetitions((prev) => [created, ...prev]);
                    }
                    // Optionally refresh in background for consistency
                    executePetitions();
                  } catch (err) {
                    // If server says petition already exists, mark as pending and refresh
                    const serverMsg = err && (err.serverData?.message || err.serverData || err.message || '');
                    const isDuplicate = String(serverMsg).toLowerCase().includes('ya enviaste') || String(serverMsg).toLowerCase().includes('ya enviaste una solicitud');
                    if (isDuplicate) {
                      // Mark as pending (don't rollback) and refresh petitions from server
                      setLocalPending((prev) => ({ ...prev, [project._id]: true }));
                      executePetitions();
                      // Optionally notify user gently
                      console.warn('Petición ya existente según el servidor:', serverMsg);
                    } else {
                      // rollback on other errors
                      setLocalPending((prev) => {
                        const copy = { ...prev };
                        delete copy[project._id];
                        return copy;
                      });
                      console.error('Error creando petición', err);
                      // If we enriched the error with server data, show it
                      if (err && err.serverData) {
                        console.error('Server error detail:', err.serverData);
                        alert(`No se pudo crear la petición: ${err.serverData.message || JSON.stringify(err.serverData)}`);
                      } else if (err && err.status) {
                        alert(`No se pudo crear la petición (status ${err.status}).`);
                      } else {
                        alert('No se pudo crear la petición. Intente de nuevo.');
                      }
                    }
                  }
                };

                return (
                  <tr key={project._id} className="border-b">
                    <td className="py-2 px-4 border">{project.name}</td>
                    <td className="py-2 px-4 border">{project.description}</td>
                    <td className="py-2 px-4 border">{project.capacity}</td>
                    <td className="py-2 px-4 border">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(project.finalDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{project.institution || '-'}</td>
                    <td className="py-2 px-4 border">{project.students?.length ?? 0}</td>
                    <td className="py-2 px-4 border">
                      <div className="flex flex-col items-start">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            petitionDisplay.color === 'green'
                              ? 'bg-green-100 text-green-800'
                              : petitionDisplay.color === 'red'
                              ? 'bg-red-100 text-red-800'
                              : petitionDisplay.color === 'yellow'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {petitionDisplay.label}
                        </span>
                        {petitionDisplay.date && (
                          <small className="text-gray-600">{new Date(petitionDisplay.date).toLocaleDateString()}</small>
                        )}
                        {petitionDisplay.reason && (
                          <small className="text-gray-600">{petitionDisplay.reason}</small>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {hasPetition || isPendingLocal ? (
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                          disabled
                        >
                          Pendiente
                        </button>
                      ) : (
                        <button
                          className="bg-blue-900 text-white px-3 py-1 rounded hover:opacity-90"
                          onClick={onInscribirme}
                        >
                          Inscribirme
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="py-2 px-4 text-center">
                  No hay proyectos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
