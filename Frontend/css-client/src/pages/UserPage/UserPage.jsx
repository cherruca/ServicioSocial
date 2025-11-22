import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPage() {
  const navigate = useNavigate();
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      // No token: send user to login
      navigate('/login', { replace: true });
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    async function loadUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (res.status === 401) {
          // token invalid/expired
          handleLogout();
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          const text = await res.text();
          throw new Error(text || `Request failed with status ${res.status}`);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load user');
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
  }

  if (!token) {
    // While navigate will redirect, render nothing to avoid flicker
    return null;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>User Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      <main style={styles.main}>
        {loading && <p>Loading profile…</p>}
        {error && (
          <div style={styles.errorBox}>
            <p style={{ margin: 0 }}>Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              style={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && user && (
          <section style={styles.card}>
            <h2 style={{ marginTop: 0 }}>
              Welcome, {user.name || user.username || user.email}
            </h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.role && (
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            )}
            {user.createdAt && (
              <p>
                <strong>Member since:</strong>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
            {/* Add more user details or actions here */}
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f0f0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
  },
};
