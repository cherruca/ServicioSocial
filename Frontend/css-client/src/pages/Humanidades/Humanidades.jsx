import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { projectService } from '../../services/projectService';
import { petitionService } from '../../services/petitionService';

// ID TEMPORAL — Reemplazar por el ID del estudiante logueado
const studentId = "673b76e1c083a1a441927ee0";

const Humanidades = () => {

  // ----- Cargar proyectos -----
  const {
    data: projects,
    loading,
    error,
    execute: loadProjects,
  } = useApi(projectService.getProjects);

  // ----- Cargar solicitudes (inscripciones) -----
  const {
    data: petitions,
    execute: loadPetitions
  } = useApi(petitionService.getPetitions);

  useEffect(() => {
    loadProjects();
    loadPetitions();
  }, []);

  //Inscribirse a un proyecto
  const handleEnroll = async (projectId) => {
    try {
      const petitionData = {
        status: true,
        students: [studentId],
        projects: [projectId],
        administrators: []
      };

      await petitionService.createPetition(petitionData);

      alert("Te has inscrito correctamente al proyecto.");
      loadPetitions(); // refrescar inscripciones

    } catch (error) {
      console.error(error);
      alert("Error al inscribirte. Verifica los datos o intenta más tarde.");
    }
  };

  //Cancelar inscripción
  const handleUnenroll = async (petitionId) => {
    try {
      await petitionService.deletePetition(petitionId);
      alert("Has cancelado tu inscripción.");

      loadPetitions(); // refrescar lista

    } catch (error) {
      console.error(error);
      alert("Error al cancelar la inscripción.");
    }
  };

  // Para ver si el estudiante ya está inscrito en un proyecto
  const getStudentPetitionForProject = (projectId) => {
    if (!petitions) return null;

    return petitions.find(p =>
      p.students.includes(studentId) &&
      p.projects.includes(projectId)
    ) || null;
  };

  // RENDER
  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
              <th className="py-2 px-4 border">Encargado</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {projects?.length > 0 ? (
              projects.map((project) => {
                
                const petition = getStudentPetitionForProject(project._id);

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

                    <td className="py-2 px-4 border">{project.institution}</td>

                    <td className="py-2 px-4 border">
                      {project.administrators.length > 0 ? (
                        project.administrators.map((admin) => (
                          <div key={admin._id}>
                            <strong>{admin.name}</strong><br />
                            <span>{admin.email}</span>
                          </div>
                        ))
                      ) : (
                        <p>No hay administradores asignados.</p>
                      )}
                    </td>

                    {/* ====== BOTÓN ACCIÓN ====== */}
                    <td className="py-2 px-4 border text-center">
                      {petition ? (
                        <button
                          onClick={() => handleUnenroll(petition._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                        >
                          Cancelar inscripción
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(project._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
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
                <td colSpan="8" className="py-2 px-4 text-center">
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

export default Humanidades;
