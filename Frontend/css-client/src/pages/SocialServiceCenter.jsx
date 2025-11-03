import React from 'react';

const SocialServiceCenter = () => {
  const studentName = 'Daniela Ivette Reina Manzanares';
  const studentId = '00051316';
  const career = 'Ingeniería Informática';
  const totalHours = 600;
  const completedHours = 150;

  return (
    <div className="flex min-h-screen">
      <aside className="w-1/4 bg-blue-200 p-5 flex flex-col justify-center rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Información del Estudiante
        </h2>
        <p className="text-center">
          <strong>Estudiante:</strong> {studentName}
        </p>
        <p className="text-center">
          <strong>Carnet:</strong> {studentId}
        </p>
        <p className="text-center">
          <strong>Carrera:</strong> {career}
        </p>
      </aside>

      <main className="flex-1 p-5 bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-5">Centro de Servicio Social</h1>
        <div className="bg-blue-200 p-6 rounded-lg shadow-md mb-5 w-full max-w-2xl flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-center">
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

        <div className="bg-blue-200 p-6 rounded-lg shadow-md mb-5 w-full max-w-2xl flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-center">
            Servicios sociales activos
          </h2>
          <img
            src="/activos.jpg"
            alt="Servicios sociales"
            className="w-50 h-32 object-cover rounded-md mb-2"
          />
          <p className="text-center">
            Descripción de los servicios sociales activos.
          </p>
        </div>

        <div className="bg-blue-200 p-6 rounded-lg shadow-md mb-5 w-full max-w-2xl flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-center">
            Listado de proyectos de servicios sociales
          </h2>
          <img
            src="/listasocial.jpg"
            alt="Listado de proyectos"
            className="w-50 h-32 object-cover rounded-md mb-2"
          />
          <p className="text-center">
            Descripción de los proyectos de servicios sociales.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SocialServiceCenter;
