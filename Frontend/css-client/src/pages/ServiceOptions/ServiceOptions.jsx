import React from 'react';  
import { useNavigate } from 'react-router-dom';  

const ServiceOptions = () => {  
  const navigate = useNavigate();  

  return (  
    <div className="bg-white-100 flex flex-col items-center h-full">  
      <h2 className="text-3xl font-bold text-center text-background mx-10 mt-5">  
        Opciones de servicio social  
      </h2>  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl w-full mx-8 mt-10">  
        <div   
          className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"   
          onClick={() => navigate('/humanidades')} // Redirige a la vista de Humanidades  
        >  
          <img  
            src="/csh.png"  
            alt="Ciencias sociales y Humanidades"  
            className="w-full h-48 object-cover"  
          />  
          <div className="p-4">  
            <h3 className="text-lg font-semibold">  
              Ciencias sociales y Humanidades  
            </h3>  
          </div>  
        </div>  

        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
        onClick={() => navigate('/humanidades')}>  
          <img  
            src="/ingenieria.jpg"  
            alt="Ingeniería y Arquitectura"  
            className="w-full h-48 object-cover"  
          />  
          <div className="p-4">  
            <h3 className="text-lg font-semibold">Ingeniería y Arquitectura</h3>  
          </div>  
        </div>  

        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
        onClick={() => navigate('/humanidades')}>  
          <img  
            src="/todas.jpg"  
            alt="Proyectos para todas las facultades"  
            className="w-full h-48 object-cover"  
          />  
          <div className="p-4">  
            <h3 className="text-lg font-semibold">  
              Proyectos para todas las facultades  
            </h3>  
          </div>  
        </div>  

        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
        onClick={() => navigate('/humanidades')}>  
          <img  
            src="/economia.jpg"  
            alt="Ciencias económicas y empresariales"  
            className="w-full h-48 object-cover"  
          />  
          <div className="p-4">  
            <h3 className="text-lg font-semibold">  
              Ciencias económicas y empresariales  
            </h3>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default ServiceOptions;