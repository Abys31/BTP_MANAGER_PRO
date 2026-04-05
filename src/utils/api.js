const BASE = '/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('btp_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const request = async (method, path, body) => {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: getHeaders(),
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    if (res.status === 401) {
      localStorage.removeItem('btp_token');
      localStorage.removeItem('btp_user');
      window.location.href = '/login';
      return null;
    }
    return res.json();
  } catch (err) {
    console.error('API Error:', err);
    return { success: false, message: 'Erreur réseau' };
  }
};

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
};
