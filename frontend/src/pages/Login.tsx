import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, KeyRound, Activity } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // GUARDAMOS LA PULSERA VIP (TOKEN)
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        
        // Redirigimos al panel principal
        navigate('/');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        
        {/* Encabezado Decorativo */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Acceso Seguro</h1>
          <p className="text-blue-100 text-sm mt-1">Sistema Clínico Dental</p>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                <Activity size={16} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 ml-1">Usuario</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                  placeholder="Ej: doctora"
                  required
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 ml-1">Contraseña</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                  placeholder="••••••••"
                  required
                />
                <KeyRound className="absolute left-3 top-3.5 text-gray-400" size={20} />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              Iniciar Sesión
            </button>
          </form>
          
          <p className="text-center text-xs text-gray-400 mt-6">
            Software de Gestión Odontológica v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;