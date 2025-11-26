import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../states/AuthContext';
import { colours } from '../../util/colors';
import axiosInstance from '../../util/axiosInstance';

const ProjectsManagement = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    startDate: '',
    finalDate: '',
    institution: '',
  });

  // Check admin role on mount
  useEffect(() => {
    const storedUser =
      typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const storedRole =
      typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    if (!storedUser || !storedRole) {
      navigate('/login', { replace: true });
      return;
    }

    if (storedRole !== 'administrator') {
      navigate('/user', { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error('Error al leer user de localStorage', e);
      logout();
      navigate('/login', { replace: true });
    }
  }, [navigate, logout]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/project/projects');
        setProjects(res.data?.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      capacity: '',
      startDate: '',
      finalDate: '',
      institution: '',
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.capacity ||
      !formData.startDate ||
      !formData.finalDate ||
      !formData.institution
    ) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      if (editingProject) {
        // Update project (if endpoint exists)
        console.log('Edit project:', editingProject._id, formData);
        setError('Edición de proyectos no está implementada aún');
        // await axiosInstance.put(`/project/${editingProject._id}`, formData);
      } else {
        // Create new project
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await axiosInstance.post('/project/create', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects((prev) => [...prev, res.data?.data]);
      }
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.response?.data?.message || 'Error al guardar el proyecto');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description,
      capacity: project.capacity,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      finalDate: project.finalDate ? project.finalDate.split('T')[0] : '',
      institution: project.institution,
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectId) => {
    if (
      !window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')
    ) {
      return;
    }

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await axiosInstance.delete(`/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.response?.data?.message || 'Error al eliminar el proyecto');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <p>Cargando información del administrador…</p>
      </div>
    );
  }

  const adminName = user.name || user.given_name || 'Administrador';
  const adminEmail = user.email || '';

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <aside className="w-1/4 bg-blue-200 p-5 flex flex-col items-center text-center justify-center">
        <h2 className="text-lg font-semibold mb-4 w-full">
          Información del Administrador
        </h2>
        <p className="mb-2 w-full">
          <span className="font-semibold block">Nombre:</span> {adminName}
        </p>
        <p className="mb-2 w-full">
          <span className="font-semibold block">Correo:</span> {adminEmail}
        </p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Centro de Servicio Social</h1>
          <button
            onClick={() => setShowForm(true)}
            className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition font-semibold"
            style={{ backgroundColor: colours.deepblue }}
          >
            + Agregar Proyecto
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Plataforma de Gestión"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#EEEEEE' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe el proyecto..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#EEEEEE' }}
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Capacidad *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Ej: 20"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#EEEEEE' }}
                  />
                </div>

                {/* Start Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: '#EEEEEE' }}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      name="finalDate"
                      value={formData.finalDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: '#EEEEEE' }}
                    />
                  </div>
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Institución *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="Ej: FUNTER"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#EEEEEE' }}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition font-semibold"
                    style={{ backgroundColor: colours.deepblue }}
                  >
                    {editingProject ? 'Actualizar' : 'Crear'} Proyecto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects Table */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-8">Cargando proyectos...</div>
          ) : projects.length === 0 ? (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-8 text-center text-blue-900">
              <p>No hay proyectos aún. ¡Crea uno nuevo!</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-200 border-b-2 border-blue-600">
                    <th className="px-4 py-3 text-left font-semibold">
                      Título
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Capacidad
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Institución
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Inicio
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Fin</th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr
                      key={project._id}
                      className={`border-b ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 font-semibold">
                        {project.name}
                      </td>
                      <td className="px-4 py-3 text-sm truncate max-w-xs">
                        {project.description}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {project.capacity}
                      </td>
                      <td className="px-4 py-3">{project.institution}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(project.startDate).toLocaleDateString(
                          'es-ES'
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(project.finalDate).toLocaleDateString(
                          'es-ES'
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(project)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                            title="Editar"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                            title="Eliminar"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsManagement;
