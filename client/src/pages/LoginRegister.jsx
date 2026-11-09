import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { ErrorMsg } from '../components/Status.jsx';

const empty = { firstName: '', lastName: '', email: '', password: '' };

export default function LoginRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Simplified frontend validation. Strong validation (email format, password length) is handled by Joi on the backend.
  const validate = () => {
    if (!form.email || !form.password) return 'Email and password are required.';
    if (isRegister && (!form.firstName || !form.lastName)) return 'Please enter your full name.';
    return ''; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);
    setLoading(true); setError(''); setSuccess('');
    try {
      if (isRegister) {
        await api('/auth/register', { method: 'POST', body: form });
        setMode('login'); setForm({ ...empty, email: form.email });
        setSuccess('Registration successful! Please login.');
      } else {
        // API now returns { token, user }
        const response = await api('/auth/login', { method: 'POST', body: { email: form.email, password: form.password } });
        
        // Save the token along with the user data in context and localStorage
        login({ ...response.user, token: response.token }); 
        navigate('/photos');
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="row justify-content-center"><div className="col-md-5">
      <div className="card shadow-sm"><div className="card-body p-4">
        <h3 className="mb-4 text-center">{isRegister ? 'Register' : 'Login'}</h3>
        <ErrorMsg message={error} />
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="mb-3"><label className="form-label">First Name</label>
                <input className="form-control" value={form.firstName} onChange={set('firstName')} maxLength={50} /></div>
              <div className="mb-3"><label className="form-label">Last Name</label>
                <input className="form-control" value={form.lastName} onChange={set('lastName')} maxLength={50} /></div>
            </>
          )}
          <div className="mb-3"><label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email} onChange={set('email')} /></div>
          <div className="mb-3"><label className="form-label">Password</label>
            <input type="password" className="form-control" value={form.password} onChange={set('password')} /></div>
          <button className={'btn w-100 ' + (isRegister ? 'btn-success' : 'btn-primary')} disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <a href="#" onClick={(e) => { e.preventDefault(); setMode(isRegister ? 'login' : 'register'); setError(''); setSuccess(''); }}>
            {isRegister ? 'Login here' : 'Register here'}
          </a>
        </p>
      </div></div>
    </div></div>
  );
}
