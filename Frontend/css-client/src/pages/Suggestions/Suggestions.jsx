import React from 'react';

const Suggestions = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Envíanos tus Sugerencias
      </h1>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSeUykYLwCvwQJYGL1m-Sf5UBbxsTcewpjkQnWhDhoD7uWPZ9g/viewform?embedded=true"
        width="100%"
        height="800"
        title="Formulario de Sugerencias"
        className="rounded-lg shadow-lg"
      >
        Cargando…
      </iframe>
    </div>
  );
};

export default Suggestions;
