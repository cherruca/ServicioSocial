// src/components/PetitionView.jsx
import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { petitionService } from '../services/petitionService';

const PetitionView = () => {
  const {
    data: petitions,
    loading,
    error,
    execute,
  } = useApi(petitionService.getPetitions);

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <p className="text-center">Cargando peticiones...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-5 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-center text-2xl font-bold mb-5">
        Gestión de Peticiones
      </h1>
      {petitions?.length > 0 ? (
        petitions.map((petition) => (
          <div
            key={petition._id}
            className="bg-blue-100 p-4 mb-4 rounded-lg shadow-sm"
          >
            <h2 className="text-lg font-semibold">
              Solicitud No. {petition._id}
            </h2>
            <p>
              <strong>Estudiante:</strong>{' '}
              {petition.students.map((student, index) => (
                <strong key={index}> {student.name} </strong>
              )) || 'Nombre completo'}
            </p>
            <p>
              <strong>Carnet:</strong> {petition.studentId || '00000000'}
            </p>
            <p>
              <strong>Proyecto:</strong>{' '}
              {petition.projectTitle || 'Título del proyecto'}
            </p>
            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(petition.date).toLocaleDateString() ||
                'Fecha no disponible'}
            </p>
            <p className="font-bold text-orange-600">
              {petition.status || 'Pendiente'}
            </p>
            <div className="flex justify-between mt-3">
              <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                Rechazar
              </button>
              <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Aceptar
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay peticiones disponibles.</p>
      )}
    </div>
  );
};

export default PetitionView;
