import React from 'react';
import { FacebookOutlined } from '@ant-design/icons';

const Circles = () => {
  return (
    <div className="relative flex flex-col h-full">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('../Circulosdesktop.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          zIndex: -1,
        }}
      ></div>
      <div className="relative bg-white bg-opacity-80 shadow-lg p-6 flex-grow">
        <h1 className="text-3xl font-bold text-center text-background ">
          Círculos de estudio
        </h1>

        <div className="  mx-10 mt-12">
          <h2 className="text-2xl font-semibold text-gray-800">
            Objetivo general
          </h2>
          <p className="text-xl text-gray-700 mt-8">
            Fortalecer las bases académicas de los jóvenes universitarios
            inscritos en el primer y segundo año de la carrera universitaria.
          </p>
        </div>

        <div className=" mx-10  mt-12">
          <h2 className="text-2xl font-semibold text-gray-800">
            ¿De qué se tratan los Círculos de estudio?
          </h2>
          <p className="text-xl text-gray-700 mt-8 text-justify">
            La Universidad Centroamericana “José Simeón Cañas”, UCA ofrece un
            espacio de refuerzo académico a aquellos jóvenes que en los primeros
            dos años de la carrera por diversas razones encuentran dificultades
            para integrarse al nivel de exigencia académica que la universidad
            requiere. Movidos por la solidaridad y el deseo de compartir
            conocimiento y desarrollar hábitos de estudio en la población
            interesada, el Centro de Servicio Social en coordinación con el área
            académica organizará a manera de plan piloto un refuerzo académico
            con el apoyo de estudiantes en servicio social. Uno de los espacios
            que ofrece la Universidad para reforzar académicamente lo visto en
            clase es mediante las instructorías que cada departamento asigna con
            instructores asignados para tal fin.
          </p>
        </div>
        <div className=" text-xl mx-10  mt-10">
          <p className="text-gray-700 text-justify">
            La modalidad de los círculos de estudio no busca reducir con esta
            nueva figura de atención al estudiante. Mucho menos con el
            catedrático de la asignatura que está siendo tutorada. Por el
            contrario, el rol del catedrático y de sus instructores es de suma
            importancia en la búsqueda de los candidatos a ser tutores y
            tutorados. En primera instancia el estudiante interesado en ser
            tutorado agotará la figura de las instructorías para aclarar las
            dudas en su o ampliar conocimiento. El instructor en coordinación
            con el catedrático sugerirá al orientador académico por departamento
            de los estudiantes a formar parte de los círculos de estudio y le
            indicará al estudiante candidato inscribirse con el orientador
            académico del departamento para formar parte de dichos círculos.
          </p>
        </div>
        <div className="mt-60">
          <a
            href="https://www.facebook.com/people/C%C3%ADrculos-de-Estudio-UCA/100058719037439/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-xl font-semibold flex items-center justify-center"
          >
            <FacebookOutlined className="mr-2 text-xl" />
            Visítanos en Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default Circles;
