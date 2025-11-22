import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../util/axiosInstance';

const UserPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);     // datos del token de Google
  const [dbUser, setDbUser] = useState(null); // datos reales desde Mongo

  // Bandera para evitar llamar /user/signin dos veces en modo StrictMode
  const hasFetchedRef = useRef(false);

  // Leer el usuario guardado por el login de Google y verificar/crear en la BD
  useEffect(() => {
    const storedUser =
      typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const storedToken =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!storedUser || !storedToken) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      axiosInstance
        .post('/user/signin', { token: storedToken })
        .then((res) => {
          console.log('Respuesta de /user/signin:', res.data);
          const { role, data } = res.data || {};

          // Si es ADMIN → guardar datos básicos y redirigir a /admin
          if (role === 'administrator') {
            localStorage.setItem('role', 'administrator');
            if (data) {
              localStorage.setItem('dbUser', JSON.stringify(data));
            }
            navigate('/admin', { replace: true });
            return;
          }

          // Si es ESTUDIANTE
          if (data) {
            setDbUser(data);
            localStorage.setItem('role', 'student');
            localStorage.setItem('dbUser', JSON.stringify(data));
          }
        })
        .catch((error) => {
          console.error('Error llamando a /user/signin:', error);
        });
    } catch (e) {
      console.error('Error al leer user de localStorage', e);
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
    setUser(null);
    setDbUser(null);
    navigate('/login', { replace: true });
  };

  if (!user) {
    // Mientras se carga el user del localStorage
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <p>Cargando información del usuario…</p>
      </div>
    );
  }

  const studentName =
    dbUser?.name || user.name || user.given_name || 'Estudiante';

  const studentId =
    dbUser?.carnet || user.email?.split('@')[0] || '00000000';

  const career = 'Ingeniería Informática';

  const totalHours = 600;                 // horas totales
  const completedHours = dbUser?.hours ?? 0; // horas desde Mongo (0 por defecto)

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <aside className="w-1/4 bg-blue-200 p-5 flex flex-col justify-center">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Información del Estudiante
        </h2>
        <p className="text-center mb-2">
          <span className="font-semibold">Estudiante:</span> {studentName}
        </p>
        <p className="text-center mb-2">
          <span className="font-semibold">Carnet:</span> {studentId}
        </p>
        <p className="text-center mb-2">
          <span className="font-semibold">Correo:</span> {user.email}
        </p>
        <p className="text-center">
          <span className="font-semibold">Carrera:</span> {career}
        </p>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-5 bg-gray-50 flex flex-col items-center justify-center">
        {/* Título + botón de logout */}
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Centro de Servicio Social</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Tarjeta: Mis horas sociales */}
        <div className="bg-blue-200 p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl transition-transform transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-center mb-4">
            Mis horas sociales
          </h2>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-4 bg-gray-300 rounded-full">
              <div
                className="absolute h-full bg-blue-600 rounded-full"
                style={{ width: `${(completedHours / totalHours) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2">
              {completedHours} / {totalHours} horas
            </span>
          </div>
        </div>

        {/* Tarjeta: Servicios sociales activos (quemado) */}
        <div className="bg-blue-200 p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl transition-transform transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-center mb-4">
            Servicios sociales activos
          </h2>
          <ul className="list-disc list-inside">
            <li>Apoyo en laboratorio de cómputo</li>
            <li>Tutorías de programación básica</li>
            <li>Soporte técnico a la comunidad UCA</li>
          </ul>
        </div>

        {/* Tarjeta: Listado de proyectos (también quemado) */}
        <div className="bg-blue-200 p-6 rounded-lg shadow-md w-full max-w-2xl transition-transform transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-center mb-4">
            Listado de proyectos de servicios sociales
          </h2>
          <ul className="list-disc list-inside">
            <li>Proyecto 1: Plataforma de gestión de servicio social</li>
            <li>Proyecto 2: Soporte a laboratorios de la FIA</li>
            <li>Proyecto 3: Acompañamiento a estudiantes de nuevo ingreso</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default UserPage;
