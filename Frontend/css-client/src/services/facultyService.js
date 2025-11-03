import axiosInstance from '../util/axiosInstance'; 

const getFaculties = async () => {
  const response = await axiosInstance.get('/faculty/faculties'); 
  return response.data; 
};

const getFacultyById = async (id) => {
  const response = await axiosInstance.get(`/faculty//faculties/${id}`); 
  return response.data;
};

const createFaculty = async (facultyData) => {
  const response = await axiosInstance.post('/project/projects', facultyData); 
  return response.data;
};

const updateFaculty = async (id, updatedData) => {
  const response = await axiosInstance.put(`/faculty//faculties/${id}`,updatedData); 
  return response.data;
};

const deleteFaculty = async (id) => {
  const response = await axiosInstance.delete(`/faculty//faculties/${id}`); 
  return response.data;
};


export const facultyService = {
  getFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
