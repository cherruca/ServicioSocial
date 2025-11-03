import React from 'react';

const Css = () => {
  return (
    <div className="relative flex flex-col h-full">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('uca.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          zIndex: -1,
        }}
      ></div>

      <div className="text-justify relative bg-white bg-opacity-80 shadow-lg p-6 flex-grow">
        <h1 className="text-3xl font-bold text-center text-blue-900">
          Historia del CSS
        </h1>

        <div className="flex flex-col lg:flex-row mt-10">
          <div className="lg:w-2/3 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Línea de Tiempo CSS UCA
            </h2>
            <div className=" text-xl text-justify  text-black space-y-4">
              <p>
                <strong>1973-1981</strong> - Es la Creación del CSS y Proyección
                Social
              </p>
              <ul className=" text-xl text-justify  list-disc pl-6">
                <li>
                  <strong>16 de mayo de 1973:</strong> Aprobación del primer
                  reglamento de servicio social.
                </li>
                <li>
                  <strong>Septiembre 1973:</strong> Creación del Centro de
                  Proyección Social.
                </li>
                <li>
                  <strong>1976:</strong> Seminario “La UCA hacia el Futuro,”
                  diferenciación entre Servicio Social y Proyección Social.
                </li>
                <li>
                  <strong>1978:</strong> Inicio de programas como
                  Alfabetización, Teatro Popular, y otros proyectos
                  comunitarios.
                </li>
              </ul>

              <p>
                <strong>1982-1988</strong> - Estancamiento por el Conflicto
                Armado
              </p>
              <p>
                Situación de violencia limita el alcance del CSS, reduciendo
                personal y actividades.
              </p>
              <ul className=" text-xl text-justify  list-disc pl-6">
                <li>
                  <strong>2 de mayo de 1988:</strong> Traslado a nuevos locales
                  y reestructuración administrativa.
                </li>
              </ul>

              <p>
                <strong>1989-1991</strong> - Preparación para un Nuevo Contexto
              </p>
              <ul className=" text-xl text-justify  list-disc pl-6">
                <li>
                  Modernización de registros con informática y actualización del
                  reglamento de servicio social.
                </li>
                <li>
                  <strong>1991:</strong> Financiamiento de Alemania para
                  fortalecer el CSS.
                </li>
              </ul>

              <p>
                <strong>1992-1999</strong> - Crecimiento y Apertura a
                Comunidades Rurales
              </p>
              <ul className=" text-xl text-justify  list-disc pl-6">
                <li>
                  <strong>1992:</strong> Firma de los Acuerdos de Paz permite
                  expansión del CSS en zonas rurales.
                </li>
                <li>
                  Apoyo a comunidades ex-conflictivas y colaboración con
                  cooperativas y asociaciones.
                </li>
                <li>
                  Aumento de personal y ampliación de áreas de trabajo a ocho
                  (tecnología, derechos humanos, etc.).
                </li>
              </ul>

              <p>
                <strong>2000-2008</strong> - Maduración y Especialización
              </p>
              <ul className=" text-xl text-justify  list-disc pl-6">
                <li>
                  <strong>2002:</strong> Primera Feria de la Solidaridad para
                  visibilizar el trabajo social de estudiantes.
                </li>
                <li>
                  <strong>2005:</strong> Proyecto de Refuerzos Escolares en
                  comunidades urbano-marginales.
                </li>
                <li>
                  Aumento de colaboraciones con instituciones como FEDECRÉDITO y
                  FUNDE.
                </li>
              </ul>

              <p>
                <strong>2011-2022</strong> - Era de la Comunicación y las TIC
              </p>
              <ul className=" text-xl text-justify  list-disc pl-6">
                <li>
                  <strong>2011:</strong> Uso de redes sociales y mejora del
                  sistema informativo SICSSE.
                </li>
                <li>
                  <strong>2012:</strong> Expansión de Círculos de Estudio, con
                  apoyo para estudiantes en sus primeros años.
                </li>
                <li>
                  <strong>2015:</strong> Lanzamiento de la página web y primera
                  edición de la revista Transforma Realidades.
                </li>
                <li>
                  <strong>2017:</strong> Nuevo Reglamento de Servicio Social
                  aprobado, enfatizando trabajo en contacto con sectores
                  vulnerables.
                </li>
                <li>
                  <strong>2021:</strong> Reconocimiento de los Círculos de
                  Estudio como una buena práctica universitaria.
                </li>
                <li>
                  <strong>2022:</strong> Continuación de la modalidad virtual y
                  reinicio de actividades semipresenciales.
                </li>
              </ul>
            </div>
          </div>

          <div className=" text-xl text-justify  lg:w-1/3 p-6 flex justify-center items-center">
            <img
              src="history.png"
              alt="Historia CSS"
              className=" text-xl text-justify  rounded-lg shadow-lg mr-96 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Css;
