import React from 'react';
import { colours } from '../../util/colors';
import { TbSchool, TbCalendarStar, TbNotes } from 'react-icons/tb';

const Documents = () => {
  return (
    <div className="bg-100 p-5">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('../documentos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: -1,
        }}
      ></div>
      <div className="relative text-center p-16 text-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
          style={{ backgroundImage: "url('/images/documentos.jpg')" }}
        ></div>
        <h1 className="relative text-3xl mb-5 z-10 font-bold">Documentos</h1>
        <div className="relative flex justify-between items-center flex-wrap mt-24 mx-28">
          <div className="flex flex-col items-center text-center m-2 flex-1 min-w-[150px] transition-transform transform hover:scale-105 hover:shadow-xl p-16 rounded-3xl">
            <TbSchool size={200} color={colours.deepblue} />
            <p>Plan de trabajo del estudiante</p>
          </div>
          <div className="flex flex-col items-center text-center m-2 flex-1 min-w-[150px] transition-transform transform hover:scale-105 hover:shadow-xl p-16 rounded-3xl">
            <TbNotes size={200} color={colours.winered} />
            <p>Guía de informe final</p>
          </div>
          <div className="flex flex-col items-center text-center m-2 flex-1 min-w-[150px] transition-transform transform hover:scale-105 hover:shadow-xl p-16 rounded-3xl">
            <TbCalendarStar size={200} color={colours.green} />
            <p>Control de asistencia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
