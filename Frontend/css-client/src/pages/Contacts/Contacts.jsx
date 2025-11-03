import React, { useState } from 'react';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import { TbListDetails } from 'react-icons/tb';

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const contacts = [
    {
      name: 'Jesús Ernesto Carranza Molina',
      role: 'Coordinador Círculos de Estudio',
      phone: '2210-6600, 2210-6680',
      extension: '427',
      email: 'circulosdeestudio@uca.edu.sv',
    },
    {
      name: 'Consuelo Noemi Letona Aguirre',
      role: 'Asistente Administrativo',
      phone: '2210-6600, 2210-6680',
      extension: '427',
      email: 'css@uca.edu.sv',
    },
    {
      name: 'Evelyn Margarita Salgado Mena',
      role: 'Jefatura de Servicio Social',
      phone: '2210-6600, 2210-6680',
      extension: '427',
      email: 'esalgado@uca.edu.sv',
    },
    {
      name: 'Juan Carlos Moreno Granados',
      role: 'Coordinador de Servicio Social',
      phone: '2210-6600, 2210-6680',
      extension: '427',
      email: 'jmoreno@uca.edu.sv',
    },
    {
      name: 'Óscar Humberto Arias Rosa',
      role: 'Coordinador de Servicio Social',
      phone: '2210-6600, 2210-6680',
      extension: '427',
      email: 'oarias@uca.edu.sv',
    },
    {
      name: 'Lissette Gabriela Zaldivar Morales',
      role: 'Coordinador de Servicio Social',
      phone: '2210-6600, 2210-6680',
      extension: '427',
      email: 'lzaldivar@uca.edu.sv',
    },
  ];

  return (
    <div className="relative flex flex-col h-full">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('social.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          zIndex: -1,
        }}
      ></div>

      <div className="relative bg-white bg-opacity-80 shadow-lg p-6 flex-grow">
        <h1 className="mt-10 text-3xl font-bold text-center text-background">
          Contacto
        </h1>

        <div className="flex flex-col items-center mt-10">
          <p className="mb-8 text-gray-600 text-xl">
            Haz click en el ícono para desplegar el directorio
          </p>
          <TbListDetails
            className="text-4xl text-gray-800 hover:text-blue-600 cursor-pointer"
            onClick={toggleModal}
          />
        </div>

        <div className="mt-20 text-center">
          <p className="text-xl font-semibold text-gray-800">Ubicación:</p>
          <p className="text-xl text-gray-700 text-center">
            El Centro de Servicio Social está ubicado cerca de la Capilla de la
            UCA, frente a la parte trasera del Módulo B de profesores.
          </p>
          <p className=" mt-10 text-xl font-semibold text-gray-800">
            Teléfonos:
          </p>
          <p className="text-xl text-gray-700">
            2210-6600 Ext. 427 y 2210-6680.
          </p>

          <p className="mt-14 text-xl font-semibold text-gray-800">Email:</p>
          <p className="text-gray-700">
            <a
              href="mailto:centro.serviciosocial@uca.edu.sv"
              className="text-xl text-blue-600 hover:underline"
            >
              centro.serviciosocial@uca.edu.sv
            </a>
          </p>

          <div className="mt-20 flex justify-center space-x-6">
            <a
              href="https://www.facebook.com/cssuca/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black text-2xl hover:text-blue-800"
            >
              <FacebookOutlined />
            </a>

            <a
              href="https://twitter.com/CSSUCA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black text-2xl hover:text-blue-800"
            >
              <TwitterOutlined />
            </a>

            <a
              href="https://www.instagram.com/cssuca/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black text-2xl hover:text-blue-800"
            >
              <InstagramOutlined />
            </a>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[700px] max-h-[80vh] overflow-y-auto">
            <h2 className=" text-center text-xl font-bold text-gray-800 mb-4">
              Directorio de Contactos
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {contacts.map((contact, index) => (
                <div key={index} className="text-gray-700">
                  <p className="font-semibold">{contact.name}</p>
                  <p>{contact.role}</p>
                  <p>Teléfono(s): {contact.phone}</p>
                  <p>Extensión(es): {contact.extension}</p>
                  <p>
                    Email:{' '}
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
