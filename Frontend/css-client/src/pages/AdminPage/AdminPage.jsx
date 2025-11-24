import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../states/AuthContext';

const AdminPage = () => {
  const navigate = useNavigate();

  const { logout } = useAuth(); 
  
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

  const adminName = user.name || user.given_name || 'Administrador';
  const adminEmail = user.email || '';

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
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

      <main className="flex-1 p-5 bg-gray-50 flex flex-col items-center">
        <div className="w-full flex justify-end items-center mb-6 relative">
          
          <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2">
            Centro de Servicio Social
          </h1>
          
        </div>

        <div className="w-full max-w-2xl mt-12">
            <div className="bg-blue-200 p-6 rounded-lg shadow-md w-full text-center">
              <h2 className="text-xl font-semibold mb-2">
                Pantalla de administrador
              </h2>
              <p>Bienvenido/a, {adminName}.</p>
              <p>Correo: {adminEmail}</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;