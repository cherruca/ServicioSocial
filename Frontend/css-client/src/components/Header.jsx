import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import { pages } from '../util/pages';
import { UserOutlined } from '@ant-design/icons';

const Header = () => {
  return (
    <header className="bg-background text-white">
      <div className="flex items-center justify-between px-5 py-2">
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <h1 className="text-xl font-bold text-center flex-grow">
          Centro de Servicio Social
        </h1>
        <Link
          to={pages.login}
          className="user-icon text-white hover:text-gray-300 transition-colors"
        >
          <UserOutlined />
        </Link>
      </div>
      <nav className="bg-secondary">
        <ul className="flex justify-center list-none p-2 m-0">
          <li className="mx-4">
            <Link
              to={pages.home}
              className="text-blue-900 font-bold hover:text-blue-700 transition-colors"
            >
              Inicio
            </Link>
          </li>
          <li className="mx-4">
            <Link
              to={pages.css}
              className="text-blue-900 font-bold hover:text-blue-700 transition-colors"
            >
              CSS
            </Link>
          </li>
          <li className="mx-4">
            <Link
              to={pages.contacts}
              className="text-blue-900 font-bold hover:text-blue-700 transition-colors"
            >
              Contacto
            </Link>
          </li>
          <li className="mx-4">
            <Link
              to={pages.circles}
              className="text-blue-900 font-bold hover:text-blue-700 transition-colors"
            >
              Círculos de estudio
            </Link>
          </li>
          <li className="mx-4">
            <Link
              to={pages.suggestions}
              className="text-blue-900 font-bold hover:text-blue-700 transition-colors"
            >
              Sugerencias
            </Link>
          </li>
          <li className="mx-4">
            <Link
              to={pages.documents}
              className="text-blue-900 font-bold hover:text-blue-700 transition-colors"
            >
              Documentos
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
