export const useAuth = () => {
    const handleLogout = () => {
        console.log('Sesión cerrada');
        // Aquí podrías eliminar tokens de localStorage o realizar otras acciones
        localStorage.removeItem('token');

    };

    return { handleLogout };
};
