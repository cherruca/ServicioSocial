import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from '../../util/axiosInstance';
import { useAuth } from '../../states/AuthContext';

const Login = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    console.log('Google Sign In Success', credentialResponse);

    const token = credentialResponse?.credential;
    if (!token) {
      console.error('[login] no credential token in Google response');
      return;
    }

    // Try to dynamically import jwt-decode to handle bundler interop
    let decode = null;
    try {
      const jwtModule = await import('jwt-decode');
      const decodeFn = jwtModule && (jwtModule.default ?? jwtModule);
      if (typeof decodeFn === 'function') {
        decode = decodeFn(token);
      } else {
        console.warn(
          '[login] jwt-decode decode function not found, skipping local decode'
        );
      }
    } catch (e) {
      console.warn(
        '[login] dynamic import of jwt-decode failed, skipping local decode',
        e
      );
    }
    console.log('decoded:', decode);

    // Build JSON payload. Send property 'token' because backend middleware looks for req.body.token.
    const payload = { token, decoded: decode };

    try {
      console.log('[login] sending /auth/login payload:', {
        tokenShort: `${token.slice(0, 10)}...`,
      });
      const res = await axios.post('/auth/login', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Backend /auth/login response:', res.status, res.data);

      // Check if role is returned directly from /auth/login (for immediate admin detection)
      const roleFromLogin = res.data?.role;
      console.log(
        '[login] roleFromLogin extracted:',
        roleFromLogin,
        'type:',
        typeof roleFromLogin
      );

      if (roleFromLogin === 'administrator') {
        console.log('[login] Admin detected! Redirecting to /admin');
        localStorage.setItem('role', 'administrator');
        if (res.data?.user) {
          localStorage.setItem('dbUser', JSON.stringify(res.data.user));
        }
        // Also store user for AdminPage to read
        let userToStore = null;
        if (decode) {
          userToStore = decode;
        } else if (res.data && res.data.user) {
          const db = res.data.user;
          userToStore = {
            name: db.name || db.email || 'Administrador',
            email: db.email || '',
            picture: db.picture || db.avatar || '',
          };
        } else {
          userToStore = { email: '' };
        }
        localStorage.setItem('user', JSON.stringify(userToStore));
        localStorage.setItem('token', token);
        // Update Auth context immediately so header and other components refresh
        try {
          login(userToStore);
        } catch (e) {}
        navigate('/admin', { replace: true });
        return;
      }

      console.log('[login] Not admin, proceeding to student flow');

      // Store the decoded Google payload in localStorage as `user` so existing UI works.
      // If decoding failed (decode is null), synthesize a compatible object from backend response.
      let userToStore = null;
      if (decode) {
        userToStore = decode;
      } else if (res.data && res.data.user) {
        // Build a minimal user object compatible with components: { name, email, picture }
        const db = res.data.user;
        userToStore = {
          name: db.name || db.email || 'Estudiante',
          email: db.email || '',
          picture: db.picture || db.avatar || '',
        };
      } else {
        userToStore = { email: '' };
      }
      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('token', token);
      try {
        login(userToStore);
      } catch (e) {}

      navigate('/user');
    } catch (err) {
      console.error('Backend verification failed - full error:', err);
      if (err?.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      // fallback: store the decoded token locally so app still has user info
      if (decode) {
        localStorage.setItem('user', JSON.stringify(decode));
        localStorage.setItem('token', token);
        setLoading(false);
        navigate('/user');
      }
      // ensure loading is cleared even if decode isn't available
      setLoading(false);
    }
  };

  const handleError = () => {
    console.log('Google Sign In Error');
  };

  return (
    <div
      className="flex items-center justify-center h-full bg-cover bg-center"
      style={{ backgroundImage: "url('/log.jpg')" }}
    >
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
