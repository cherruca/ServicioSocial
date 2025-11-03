import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';

const ProjectForm = () => {
  const [project, setProject] = useState({
    name: '',
    capacity: 0,
    startDate: '',
    finalDate: '',
    institution: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchProject = async () => {
        try {
          const fetchedProject = await projectService.getProjectById(id);
          setProject(fetchedProject);
        } catch (error) {
          console.error('Error fetching project:', error);
        }
      };
      fetchProject();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedProject = {
        ...project,
        startDate: new Date(project.startDate).toISOString(),
        finalDate: new Date(project.finalDate).toISOString(),
      };
      console.log(formattedProject);

      if (isEditing) {
        await projectService.updateProject(id, formattedProject);
      } else {
        await projectService.createProject(formattedProject);
      }
      navigate('/projects');
    } catch (error) {
      console.error(
        'Error saving project:',
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-5">
        {isEditing ? 'Modificar Proyecto' : 'Crear Proyecto'}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-5 rounded shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-1" htmlFor="name">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={project.name}
            onChange={handleChange}
            required
            className="border rounded w-full p-2 bg-blue-50 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="description">
            Descripcion
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            required
            className="border rounded w-full p-2 bg-blue-50 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="institution">
            Institucion
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={project.institution}
            onChange={handleChange}
            required
            className="border rounded w-full p-2 bg-blue-50 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="capacity">
            Capacidad
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={project.capacity}
            onChange={handleChange}
            required
            className="border rounded w-full p-2 bg-blue-50 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="startDate">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={project.startDate.split('T')[0]}
            onChange={handleChange}
            required
            className="border rounded w-full p-2 bg-blue-50 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="finalDate">
            Fecha Final
          </label>
          <input
            type="date"
            id="finalDate"
            name="finalDate"
            value={project.finalDate.split('T')[0]}
            onChange={handleChange}
            required
            className="border rounded w-full p-2 bg-blue-50 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="bg-gray-300 py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
