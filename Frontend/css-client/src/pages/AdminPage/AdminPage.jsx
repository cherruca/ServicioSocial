import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('dbUser');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('dbUser');
    navigate('/login', { replace: true });
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
      <aside className="w-1/4 bg-blue-200 p-5 flex flex-col justify-center">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Información del Administrador
        </h2>
        <p className="text-center mb-2">
          <span className="font-semibold">Nombre:</span> {adminName}
        </p>
        <p className="text-center mb-2">
          <span className="font-semibold">Correo:</span> {adminEmail}
        </p>
      </aside>

      <main className="flex-1 p-5 bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Centro de Servicio Social</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="bg-blue-200 p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
          <h2 className="text-xl font-semibold mb-2">
            Pantalla de administrador
          </h2>
          <p>Bienvenido/a, {adminName}.</p>
          <p>Correo: {adminEmail}</p>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
