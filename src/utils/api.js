const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('btp_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) localStorage.setItem('btp_token', data.token);
    return data;
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  getUsers: async () => {
    const res = await fetch(`${API_URL}/auth/users`, { headers: getHeaders() });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // Marches
  getMarches: async () => {
    const res = await fetch(`${API_URL}/marches`, {
      headers: getHeaders()
    });
    return res.json();
  },

  createMarche: async (marcheData) => {
    const res = await fetch(`${API_URL}/marches`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(marcheData)
    });
    return res.json();
  },

  // Attachments
  createAttachment: async (attachmentData) => {
    const res = await fetch(`${API_URL}/attachments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(attachmentData)
    });
    return res.json();
  },

  // Staff (RH)
  getStaff: async () => {
    const res = await fetch(`${API_URL}/staff`, { headers: getHeaders() });
    return res.json();
  },
  createStaff: async (staffData) => {
    const res = await fetch(`${API_URL}/staff`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(staffData)
    });
    return res.json();
  },

  // Logistics (BL)
  getLogistics: async () => {
    const res = await fetch(`${API_URL}/logistics`, { headers: getHeaders() });
    return res.json();
  },
  createLogistics: async (logisticsData) => {
    const res = await fetch(`${API_URL}/logistics`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(logisticsData)
    });
    return res.json();
  },

  // Documents
  getDocuments: async () => {
    const res = await fetch(`${API_URL}/documents`, { headers: getHeaders() });
    return res.json();
  },
  createDocument: async (docData) => {
    const res = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(docData)
    });
    return res.json();
  }
};
