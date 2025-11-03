import React from 'react';  
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';  
import { jwtDecode } from 'jwt-decode';  

const Login = () => {  
  const clientId = import.meta.env.VITE_CLIENT_ID;  

  const handleSuccess = (credencialResponse) => {  
    console.log('Google Sign In Success', credencialResponse);  

    const decode = jwtDecode(credencialResponse?.credential);  
    console.log(decode);  
  };  

  const handleError = () => {  
    console.log('Google Sign In Error');  
  };  

  return (  
    <div className="flex items-center justify-center h-full bg-cover bg-center" style={{ backgroundImage: "url('/log.jpg')" }}>  
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm bg-opacity-90">  
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">  
          Iniciar Sesión  
        </h1>  

        <GoogleOAuthProvider clientId={clientId}>  
          <GoogleLogin  
            onSuccess={handleSuccess}  
            onError={handleError}  
            style={{ width: '100%' }}  
          />  
        </GoogleOAuthProvider>  

        <p className="text-center text-gray-600 mt-4">  
          Inicia sesión con tu cuenta de Google.  
        </p>  
      </div>  
    </div>  
  );  
};  

export default Login;