import axiosInstance from '../util/axiosInstance';

const getPetitions = async () => {
  const response = await axiosInstance.get('/petition/petitions');
  return response.data;
};

const getMyPetitions = async () => {
  const response = await axiosInstance.get('/petition/my');
  return response.data;
};

const getPetitionById = async (id) => {
  const response = await axiosInstance.get(`/petition/${id}`);
  return response.data;
};

const createPetition = async (projectId) => {
  // Try to obtain current student's DB id from localStorage
  let studentId = null;
  try {
    const raw = localStorage.getItem('dbUser');
    if (raw) {
      const db = JSON.parse(raw);
      studentId = db._id || db.id || db.carnet || null;
    }
  } catch (e) {
    console.warn('Could not read dbUser from localStorage', e);
  }

  if (!studentId) {
    throw new Error('No student id found in localStorage. Please sign in again.');
  }

  const payload = { studentId, projectId };

  try {
    console.debug('Creating petition with payload:', payload);
    const response = await axiosInstance.post('/petition/enroll', payload);
    return response.data;
  } catch (err) {
    // Attach server response info to the error for easier debugging
    if (err && err.response) {
      console.error('petitionService.createPetition - server responded:', err.response.status, err.response.data);
      // throw a richer error
      const e = new Error('Server responded with error while creating petition');
      e.status = err.response.status;
      e.serverData = err.response.data;
      throw e;
    }
    throw err;
  }
};

const updatePetition = async (id, updatedData) => {
  const response = await axiosInstance.patch(`/petition/${id}`, updatedData);
  return response.data;
};

const deletePetition = async (id) => {
  const response = await axiosInstance.delete(`/petition/${id}`);
  return response.data;
};

export const petitionService = {
  getPetitions,
  getMyPetitions,
  getPetitionById,
  createPetition,
  updatePetition,
  deletePetition,
};

const approvePetition = async (id) => {
  const response = await axiosInstance.patch(`/petition/${id}/approve`);
  return response.data;
};

const rejectPetition = async (id, reason = '') => {
  const response = await axiosInstance.patch(`/petition/${id}/reject`, {
    reason,
  });
  return response.data;
};

export const petitionAdminService = {
  approvePetition,
  rejectPetition,
};
