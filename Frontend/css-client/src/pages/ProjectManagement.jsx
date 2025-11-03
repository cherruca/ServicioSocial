import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { projectService } from '../services/projectService';
import { useNavigate } from 'react-router-dom';

const ProjectManagement = () => {
  const {
    data: projects,
    loading,
    error,
    execute,
  } = useApi(projectService.getProjects);

  const navigate = useNavigate();

  useEffect(() => {
    execute();
  }, [execute]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        await projectService.deleteProject(id);
        execute();
      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
      }
    }
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-5">Gestión de Proyectos</h1>
      <button
        className="mb-5 bg-green-600 text-white py-2 px-4 rounded"
        onClick={() => navigate('/projects/new')}
      >
        Crear
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-blue-200 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p>
                <strong>Capacidad:</strong> {project.capacity}
              </p>
              <p>
                <strong>Fecha de Inicio:</strong>{' '}
                {new Date(project.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Fecha de Finalización:</strong>{' '}
                {new Date(project.finalDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Institución:</strong> {project.institution}
              </p>
              <p>
                <strong>Descripción:</strong> {project.description}
              </p>

              <h3 className="font-semibold mt-4">Encargado:</h3>
              {project.administrators.length > 0 ? (
                <ul className="list-disc list-inside">
                  {project.administrators.map((admin) => (
                    <p key={admin._id}>
                      <strong>Nombre:</strong> {admin.name} <br />
                      <strong>Email:</strong> {admin.email}
                    </p>
                  ))}
                </ul>
              ) : (
                <p>No hay administradores asignados.</p>
              )}

              <div className="flex justify-between mt-4">
                {/* <button
                  className="bg-green-700 text-white py-1 px-2 rounded"
                  //onClick={() => navigate(`/projects/edit/${project._id}`)}
                >
                  Editar
                </button> */}
                <button
                  className="bg-red-600 text-white py-1 px-2 rounded"
                  onClick={() => handleDelete(project._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay proyectos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
