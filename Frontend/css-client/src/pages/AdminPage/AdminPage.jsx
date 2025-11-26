import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../states/AuthContext';
import ProjectsManagement from './ProjectsManagement';
import PetitionsManagement from './PetitionsManagement';

const AdminPage = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [user, setUser] = useState(null);

  // active tab must be declared unconditionally (hooks must run in same order)
  const [activeTab, setActiveTab] = useState('projects');

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
      console.error('Error al leer user de localStorage en AdminPage', e);
      // Limpiar y redirigir usando la función de logout del contexto
      logout();
      navigate('/login', { replace: true });
    }
    // Añadimos 'logout' para evitar warnings de dependencias
  }, [navigate, logout]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <p>Cargando información del administrador…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 mr-3 rounded ${
            activeTab === 'projects' ? 'bg-blue-800 text-white' : 'bg-gray-200'
          }`}
        >
          Proyectos
        </button>
        <button
          onClick={() => setActiveTab('petitions')}
          className={`px-4 py-2 rounded ${
            activeTab === 'petitions' ? 'bg-blue-800 text-white' : 'bg-gray-200'
          }`}
        >
          Solicitudes
        </button>
      </div>

      <div>
        {activeTab === 'projects' ? (
          <ProjectsManagement />
        ) : (
          <PetitionsManagement />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
