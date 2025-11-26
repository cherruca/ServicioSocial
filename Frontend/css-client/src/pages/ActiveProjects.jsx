import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { projectService } from '../services/projectService';
import { useCallback } from 'react';

const ActiveProjects = () => {
  const navigate = useNavigate();

  // try to read student id from localStorage.dbUser
  let studentId = null;
  try {
    const raw = localStorage.getItem('dbUser');
    if (raw) {
      const db = JSON.parse(raw);
      studentId = db._id || db.id || db.carnet || null;
    }
  } catch (e) {
    console.warn('Could not read dbUser from localStorage', e);
  }

  const fetchProjects = useCallback(
    (axios) => projectService.getProjectsByStudentId(studentId, axios),
    [studentId]
  );

  const {
    data: projects,
    loading,
    error,
    execute,
  } = useApi(fetchProjects);

  useEffect(() => {
    if (!studentId) {
      // Do not force-redirect here; show an informative message in the UI
      // so the user can retry or re-login if needed.
      return;
    }
    execute();
  }, [execute, studentId, navigate]);

  if (loading) return <p>Cargando proyectos activos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // If there's no studentId available, prompt the user to login again
  if (!studentId) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Servicios Sociales Activos</h1>
        <p className="mb-4">No se encontró información de estudiante en tu sesión.</p>
        <p className="mb-4">Por favor inicia sesión de nuevo para ver tus servicios activos.</p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-800 text-white px-4 py-2 rounded"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Servicios Sociales Activos</h1>

      {Array.isArray(projects) && projects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="py-2 px-4 border">Nombre</th>
                <th className="py-2 px-4 border">Descripción</th>
                <th className="py-2 px-4 border">Institución</th>
                <th className="py-2 px-4 border">Fecha inicio</th>
                <th className="py-2 px-4 border">Fecha fin</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2 px-4 border">{p.name}</td>
                  <td className="py-2 px-4 border">{p.description}</td>
                  <td className="py-2 px-4 border">{p.institution || '-'}</td>
                  <td className="py-2 px-4 border">
                    {p.startDate ? new Date(p.startDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-2 px-4 border">
                    {p.finalDate ? new Date(p.finalDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="mb-4">No tienes servicios activos por el momento.</p>
          <p className="mb-4">Puedes revisar el listado de proyectos disponibles y solicitar inscripción.</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/projects-list')}
              className="bg-blue-800 text-white px-4 py-2 rounded"
            >
              Ver listado de proyectos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveProjects;
