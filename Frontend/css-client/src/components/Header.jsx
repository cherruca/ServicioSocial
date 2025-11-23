import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import logo from '/logo.png';
import { pages } from '../util/pages';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'; 
import { useAuth } from '../states/AuthContext';

const Header = () => {
  const { isLoggedIn, profilePicture, logout } = useAuth();
  const navigate = useNavigate();
  // Estado para controlar la visibilidad del menú desplegable
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  // Función para manejar el cierre de sesión desde el menú
  const handleLogout = async () => {
    setIsMenuOpen(false);
    // small delay so user perceives the loading state
    await new Promise((r) => setTimeout(r, 500));
    logout();
    navigate(pages.login); // Redirigir al login
  };

  // Función para manejar el clic en el ícono de perfil
  const handleProfileClick = () => {
    if (isLoggedIn) {
      // Si está logueado, abrimos/cerramos el menú
      setIsMenuOpen(!isMenuOpen);
    } else {
      // Si no está logueado, vamos directamente a la página de login
      navigate(pages.login);
    }
  };
  
  // Determinar la ruta a la que debe ir la foto/ícono
  const targetPage = isLoggedIn ? pages.user : pages.login;

  return (
    <header className="bg-background text-white">
      <div className="flex items-center justify-between px-5 py-2">
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <h1 className="text-xl font-bold text-center flex-grow">
          Centro de Servicio Social
        </h1>
        
        {/* ENLACE DE PERFIL/LOGIN CON MENÚ DESPLEGABLE */}
        <div className="relative"> 
          <button
            onClick={handleProfileClick}
            className="user-icon p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            {isLoggedIn && profilePicture ? (
              <img
                src={profilePicture}
                alt="Perfil"
                className="w-8 h-8 rounded-full border border-white object-cover"
              />
            ) : (
              <UserOutlined style={{ fontSize: '24px' }} />
            )}
          </button>
          
          {isLoggedIn && isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link 
                to={pages.user}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserOutlined className="mr-2" /> Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <LogoutOutlined className="mr-2" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Barra de navegación */}
      <nav className="bg-secondary">
        <ul className="flex justify-center list-none p-2 m-0">
          <li className="mx-4">
            <Link to={pages.home} className="text-blue-900 font-bold hover:text-blue-700 transition-colors">Inicio</Link>
          </li>
          <li className="mx-4">
            <Link to={pages.css} className="text-blue-900 font-bold hover:text-blue-700 transition-colors">CSS</Link>
          </li>
          <li className="mx-4">
            <Link to={pages.contacts} className="text-blue-900 font-bold hover:text-blue-700 transition-colors">Contacto</Link>
          </li>
          <li className="mx-4">
            <Link to={pages.circles} className="text-blue-900 font-bold hover:text-blue-700 transition-colors">Círculos de estudio</Link>
          </li>
          <li className="mx-4">
            <Link to={pages.suggestions} className="text-blue-900 font-bold hover:text-blue-700 transition-colors">Sugerencias</Link>
          </li>
          <li className="mx-4">
            <Link to={pages.documents} className="text-blue-900 font-bold hover:text-blue-700 transition-colors">Documentos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;