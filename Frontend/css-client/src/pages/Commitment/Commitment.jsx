import React from 'react';

const Commitment = () => {
  return (
    <div className="h-full relative text-center p-5 text-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
        style={{ backgroundImage: "url('/comp.jpg')" }}
      ></div>
      <h1 className="relative text-3xl mb-5 text-[#003161] z-10 font-bold mt-10">
        Compromisos en el servicio social
      </h1>
      <div className="text-center min-w mt-32 mx-32"> 
      <p className="relative text-xl mb-4 z-10 text-justify ">
        Dentro de los compromisos asumidos por el estudiante al iniciar el
        servicio social estudiantil se encuentra la elaboración de un Plan de
        trabajo. El responsable institucional asignado para dar seguimiento a
        las actividades del alumno se compromete a apoyar con esta tarea. Además
        de brindar la inducción necesaria para la buena ejecución de la misma.
        Cualquier cambio en el plan de trabajo como la prolongación, suspensión
        temporal o anticipada por una de las partes, un cambio del contenido o
        requerimiento de estudiantes deben ser informados inmediatamente al
        Centro de Servicio Social.
      </p>
      <p className="relative text-xl mb-4 z-10 text-justify">
        La institución/contraparte proporciona además todo lo necesario para el
        trabajo: recursos materiales, asesoría o acompañamiento continuo, y
        equipo. Si la acción social se realiza fuera de San Salvador le
        reconocerá transporte y alimentación. De ser necesario el alojamiento,
        según el caso lo amerite.
      </p>
      <p className="relative text-xl mb-4 z-10 text-justify">
        Finalizado el Servicio Social, la institución tiene la obligación de
        extender una “Carta de finalización” dirigida al Centro de Servicio
        Social donde haga constar la cantidad de horas reales trabajadas que han
        sido registradas en el “Control de Asistencia por alumno “así como la
        valoración de su desempeño.
      </p>
      <p className="relative text-xl mb-4 z-10 text-justify">
        Posteriormente sobre la base de horas sociales, el informe final
        preparado por el alumno y la información recabada en el seguimiento
        estudiantil se procede a la asignación de las horas sociales.
      </p>
      </div>
    </div>
  );
};

export default Commitment;
