import axiosInstance from '../util/axiosInstance';

const getProjects = async () => {
    const response = await axiosInstance.get('/project/projects');
    return response.data;
};

const getProjectById = async (id) => {
    const response = await axiosInstance.get(`/project/projects/${id}`);
    return response.data;
};

const createProject = async (projectData) => {
    const response = await axiosInstance.post('/project/create', projectData);
    return response.data;
};

const updateProject = async (id, updatedData) => {
    const response = await axiosInstance.put(`/project/projects/${id}`, updatedData);
    return response.data;
};

const deleteProject = async (id) => {
    const response = await axiosInstance.delete(`/project/${id}`);
    return response.data;
};

export const projectService = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};