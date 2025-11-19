import axiosInstance from '../util/axiosInstance'; 

const getPetitions = async () => {  
    const response = await axiosInstance.get('/petition/petitions'); 
    return response.data;  
};  

const getPetitionById = async (id) => {  
    const response = await axiosInstance.get(`/petition/petitions/${id}`); 
    return response.data;  
};  

const createPetition = async (petitionData) => {
    const response = await axiosInstance.post('/petition/create', petitionData);
    return response.data;
};


const updatePetition = async (id, updatedData) => {  
    const response = await axiosInstance.put(`/petition/petitions/${id}`, updatedData); 
    return response.data;  
};  

const deletePetition = async (id) => {  
    const response = await axiosInstance.delete(`/petition/petitions/${id}`); 
    return response.data;  
};  

//Inscribirse a un proyecto
const enrollProject = async (studentId, projectId) => {
    const body = {
        status: true,
        students: [studentId],
        projects: [projectId],
        administrators: [] // vacio por ahora
    };

    const response = await axiosInstance.post('/petition/create', body);
    return response.data;
};

const unassignPetition = async (studentId, projectId) => {
    const response = await axiosInstance.delete(`/petition/unassign/${studentId}/${projectId}`);
    return response.data;
};

export const petitionService = {  
    getPetitions,  
    getPetitionById,  
    createPetition,  
    updatePetition,  
    deletePetition,
    enrollProject, 
    unassignPetition
};
