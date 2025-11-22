import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { projectService } from '../../services/projectService';
import axiosInstance from '../../util/axiosInstance';

// ID TEMPORAL — Cambiar por el ID del estudiante autenticado
const studentId = "673b76e1c083a1a441927ee0";

const Humanidades = () => {

  // ---- Cargar proyectos ----
  const {
    data: projects,
    loading,
    error,
    execute: loadProjects,
  } = useApi(projectService.getProjects);

  // Estado para guardar si el estudiante está inscrito en cada proyecto
  const [enrollStatus, setEnrollStatus] = useState({});

  // ---- Consultar si está inscrito (endpoint del backend) ----
  const checkEnrollment = async (projectId) => {
    try {
      const res = await axiosInstance.get(`/petition/isEnrolled/${studentId}/${projectId}`);
      return res.data.enrolled;
    } catch (e) {
      console.error("Error consultando inscripción:", e);
      return false;
    }
  };

  // ---- Cargar estados de inscripción de todos los proyectos ----
  const loadEnrollments = async (projectList) => {
    const status = {};

    for (const project of projectList) {
      const enrolled = await checkEnrollment(project._id);
      status[project._id] = enrolled;
    }

    setEnrollStatus(status);
  };


  // ========== USE EFFECTS CORREGIDOS ==========

  // 1. Cargar proyectos solo una vez
  useEffect(() => {
    loadProjects();
  }, []);

  // 2. Cuando ya existan proyectos, cargar sus estados de inscripción
  useEffect(() => {
    if (projects && projects.length > 0) {
      loadEnrollments(projects);
    }
  }, [projects]);


  // ========== ACCIONES ==========

  const handleEnroll = async (projectId) => {
    try {
      await axiosInstance.post("/petition/enroll", {
        studentId,
        projectId
      });

      alert("Te has inscrito correctamente al proyecto.");

      // actualizar estado local
      setEnrollStatus(prev => ({
        ...prev,
        [projectId]: true
      }));

    } catch (error) {
      console.error(error);
      alert("Error al inscribirte.");
    }
  };

  const handleUnenroll = async (projectId) => {
    try {
      await axiosInstance.delete(`/petition/unassign/${studentId}/${projectId}`);

      alert("Has cancelado tu inscripción.");

      // actualizar estado local
      setEnrollStatus(prev => ({
        ...prev,
        [projectId]: false
      }));

    } catch (error) {
      console.error(error);
      alert("Error al cancelar la inscripción.");
    }
  };


  // ========== RENDER ==========
  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>Error cargando datos.</p>;


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
              <th className="py-2 px-4 border">Fecha Fin</th>
              <th className="py-2 px-4 border">Institución</th>
              <th className="py-2 px-4 border">Encargado</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {projects?.length > 0 ? (
              projects.map((project) => {

                const isEnrolled = enrollStatus[project._id];

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
                        <p>No hay administradores.</p>
                      )}
                    </td>

                    <td className="py-2 px-4 border text-center">
                      {isEnrolled ? (
                        <button
                          onClick={() => handleUnenroll(project._id)}
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
