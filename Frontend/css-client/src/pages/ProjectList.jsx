import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { projectService } from '../services/projectService';

const ProjectList = () => {
  const {
    data: projects,
    loading,
    error,
    execute,
  } = useApi(projectService.getProjects);

  useEffect(() => {
    execute();
  }, [execute]);

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
            </tr>
          </thead>
          <tbody>
            {projects?.length > 0 ? (
              projects.map((project) => (
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
                          <strong>{admin.name}</strong> <br />
                          <span>{admin.email}</span>
                        </div>
                      ))
                    ) : (
                      <p>No hay administradores asignados.</p>
                    )}
                  </td>
                </tr>
              ))
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

export default ProjectList;
