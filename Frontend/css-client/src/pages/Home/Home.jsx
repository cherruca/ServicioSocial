import React from 'react';
import useCarousel from '../../hooks/useCarousel';
import { TbCheckupList, TbBook2, TbBuildingBank } from 'react-icons/tb';
import { colours } from '../../util/colors';
import { Link } from 'react-router-dom';
import { pages } from '../../util/pages';

const Home = () => {
  const images = [
    '/banner1.jpg',
    '/banner2.jpg',
    '/banner3.png',
    '/banner4.png',
    '/banner5.png',
  ];

  const { currentIndex, handleNext, handlePrev } = useCarousel(0, images);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex justify-center items-center my-5">
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 border-none p-2 cursor-pointer text-2xl z-10"
          onClick={handlePrev}
        >
          ❮
        </button>

        <a href="https://uca.edu.sv/" target="_blank" rel="noopener noreferrer">
          <img
            src={images[currentIndex]}
            alt="Carrusel"
            className="w-full h-auto rounded-3xl cursor-pointer"
          />
        </a>

        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 border-none p-2 cursor-pointer text-2xl z-10"
          onClick={handleNext}
        >
          ❯
        </button>
      </div>
      <div className="flex justify-around my-5 space-x-4">
        <Link
          to={pages.serviceoptions}
          className="text-xl flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl p-10 bg-white rounded-3xl shadow-md hover:bg-green-50"
        >
          <TbCheckupList size={180} color={colours.green} />
          <p>Opciones de servicio social</p>
        </Link>

        <Link
          to={pages.definition}
          className="text-xl flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl p-10 bg-white rounded-3xl shadow-md hover:bg-blue-50"
        >
          <TbBook2 size={180} color={colours.deepblue} />
          <p>Definición, objetivos, Misión y Visión</p>
        </Link>

        <Link
          to={pages.commitment}
          className="text-xl flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl p-10 bg-white rounded-3xl shadow-md hover:bg-red-50"
        >
          <TbBuildingBank size={180} color={colours.winered} />
          <p>Compromisos en el servicio social</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
