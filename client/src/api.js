// Small fetch wrapper: adds the Authorization header with the JWT token and throws readable errors.
export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    // Check if user exists and has a token, then attach it to the Authorization header
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
  } catch { /* ignore */ }

  if (body) headers['Content-Type'] = 'application/json';
  
  const res = await fetch('/api' + path, { 
    method, 
    headers, 
    body: form || (body && JSON.stringify(body)) 
  });
  
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const imgUrl = (fileName) => '/uploads/' + fileName; 
