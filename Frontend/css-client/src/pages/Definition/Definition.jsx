import React from 'react';

const Definition = () => {
  return (
    <div className="bg-100 p-5">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('../vision.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: -1,
        }}
      ></div>
      <section className="mb-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">¿Quiénes somos?</h2>
        <p className="text-xl text-black-700 text-justify">
          Es la colaboración no remunerada que realiza el estudiantado, dirigida
          a apoyar, fundamentalmente, proyectos o actividades con finalidad
          social o educativa, orientados al desarrollo sostenible del país.
        </p>
      </section>

      <section className="mb-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Objetivos</h2>
        <p className="text-xl text-black-700 text-justify">
          Promover el contacto del estudiantado con la realidad del país, para
          contribuir al bien común. Brindar una oportunidad para que el
          estudiantado ponga sus conocimientos técnicos y científicos al
          servicio
        </p>
        <p className="text-blck-700 text-justify">
          de los sectores sociales más necesitados y con menos recursos.
        </p>
      </section>

      <section className="mb-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Misión y visión</h2>
        <p className="text-xl text-black-700 text-justify">
          Velar por la realización de un servicio social estudiantil, basado en
          la solidaridad, trabajo en equipo, responsabilidad y honradez. Ser una
          instancia modelo reconocida en la promoción y acompañamiento
        </p>
        <p className="text-xl text-black-700 text-justify">
          de un servicio social estudiantil que contribuya en la sensibilidad
          social.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Estructura organizacional
        </h2>
        <img
          src="/esquema.jpeg"
          alt="Estructura organizacional"
          className="mx-auto w-1/3"
        />
      </section>
    </div>
  );
};

export default Definition;
