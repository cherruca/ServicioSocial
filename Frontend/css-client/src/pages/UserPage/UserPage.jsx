import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../util/axiosInstance';
import { useAuth } from '../../states/AuthContext';

const UserPage = () => {
  const navigate = useNavigate();
  const { logout, login } = useAuth();

  const [user, setUser] = useState(null); // datos del token de Google
  const [dbUser, setDbUser] = useState(null); // datos reales desde Mongo

  const hasFetchedRef = useRef(false);

  // Leer el usuario guardado por el login de Google y verificar
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

      login(parsed);

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
      // ... (limpieza de localStorage en caso de error)
      logout();
      navigate('/login', { replace: true });
    }
    // Añadimos 'login' como dependencia para evitar warnings
  }, [navigate, login]);

  const handleLogout = () => {
    logout();
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

  const studentId = dbUser?.carnet || user.email?.split('@')[0] || '00000000';

  const career = 'Ingeniería Informática';

  const totalHours = 600; // horas totales
  const completedHours = dbUser?.hours ?? 0; // horas desde Mongo (0 por defecto)

  // Determinar la URL de la imagen (usando 'picture' confirmado en tu JSON)
  const profilePicture = user.picture;

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <aside className="w-1/4 bg-blue-200 p-5 flex flex-col items-center text-center justify-center">
        {profilePicture && (
          <>
            <img
              src={profilePicture}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-lg object-cover"
            />
            <p className="font-semibold mb-6 w-full">Foto de perfil</p>
          </>
        )}

        {/* Información del Estudiante */}
        <h2 className="text-lg font-semibold mb-4 w-full">
          Información del Estudiante
        </h2>
        <p className="mb-2 w-full">
          <span className="font-semibold block">Estudiante:</span> {studentName}
        </p>
        <p className="mb-2 w-full">
          <span className="font-semibold block">Carnet:</span> {studentId}
        </p>
        <p className="mb-2 w-full">
          <span className="font-semibold block">Correo:</span> {user.email}
        </p>
        <p className="w-full">
          <span className="font-semibold block">Carrera:</span> {career}
        </p>
      </aside>

      <main className="flex-1 p-5 bg-gray-50 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6 relative">
          <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2">
            Centro de Servicio Social
          </h1>
        </div>

        {/* --- Tarjetas de información --- */}
        <div className="w-full max-w-2xl mt-12">
          {/* Tarjeta: Mis horas sociales */}
          <div className="bg-blue-200 p-6 rounded-lg shadow-md mb-6 w-full transition-transform transform hover:scale-[1.02] hover:shadow-xl">
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

          <div className="bg-blue-200 p-6 rounded-lg shadow-md mb-6 w-full transition-transform transform hover:scale-[1.02] hover:shadow-xl">
            <h2 className="text-lg font-semibold text-center mb-4">
              Servicios sociales activos
            </h2>
            <ul className="list-disc list-inside">
              <li>Apoyo en laboratorio de cómputo</li>
              <li>Tutorías de programación básica</li>
              <li>Soporte técnico a la comunidad UCA</li>
            </ul>
          </div>

          <div className="bg-blue-200 p-6 rounded-lg shadow-md w-full transition-transform transform hover:scale-[1.02] hover:shadow-xl">
            <h2 className="text-lg font-semibold text-center mb-4">
              Listado de proyectos de servicios sociales
            </h2>
            <ul className="list-disc list-inside">
              <li>Proyecto 1: Plataforma de gestión de servicio social</li>
              <li>Proyecto 2: Soporte a laboratorios de la FIA</li>
              <li>Proyecto 3: Acompañamiento a estudiantes de nuevo ingreso</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage;
