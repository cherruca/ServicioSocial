import React from 'react';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

const Footer = () => {
  return (
    <footer className="flex justify-between items-start bg-secondary p-5 text-black">
      <div className="flex w-full">
        <div className="flex flex-col justify-start flex-1">
          <div className="flex mb-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="mr-2"
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="mr-2"
            >
              <TwitterOutlined />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <InstagramOutlined />
            </a>
          </div>
          <div className="mb-2">
            <a
              href="mailto:centro.serviciosocial@uca.edu.sv"
              className="text-xl text-black no-underline"
            >
              centro.serviciosocial@uca.edu.sv
            </a>
          </div>
          <div className="text-xl flex items-center">
            <PhoneOutlined />
            <span>2210-6600 Ext. 427 y 2210-6680.</span>
          </div>
        </div>
        <div className="text-xl flex flex-col justify-start items-end flex-shrink-0">
          <p className="m-0 text-right">
            Universidad Centroamericana José Simeón Cañas
          </p>
          <p className="m-0 text-right">
            Bulevar Los Próceres, Antiguo Cuscatlán, La Libertad, El Salvador,
            Centroamérica.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
