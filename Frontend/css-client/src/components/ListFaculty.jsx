import React, { useEffect } from 'react';  
import { useApi } from '../hooks/useApi';  
import { facultyService } from '../services/facultyService';  

const ListFaculty = () => {  
    const { data, loading, error, execute } = useApi(facultyService.getFaculties);  

    useEffect(() => {  
        execute();  
    }, [execute]); 

    if (loading) return <p>Cargando facultades...</p>;  
    if (error) return <p>Error: {error.message}</p>;  

    return (  
        <div>  
            <h1>Listado de Facultades</h1>  
            {data?.length > 0 ? (  
                <ul>  
                    {data.map((faculty) => (  
                        <li key={faculty._id}>  
                            <strong>Nombre:</strong> {faculty.name} <br />  
                            <strong>ID:</strong> {faculty._id}  
                        </li>  
                    ))}  
                </ul>  
            ) : (  
                <p>No hay facultades disponibles.</p>  
            )}  
        </div>  
    );  
};  

export default ListFaculty;  