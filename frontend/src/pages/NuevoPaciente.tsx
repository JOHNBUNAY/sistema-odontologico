import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, CreditCard, Phone, Mail, Calendar, Save, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';

function NuevoPaciente() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    fecha_nacimiento: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/pacientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('¡Paciente registrado con éxito! 🎉');
        navigate('/');
      } else {
        alert('Error: Revisa que la cédula no esté repetida.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-200 transition text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Paciente</h1>
            <p className="text-gray-500">Ingresa los datos personales para crear el expediente.</p>
          </div>
        </div>

        {/* TARJETA DEL FORMULARIO */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Nombre */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      name="nombre"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Ej: Juan Pérez"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Cédula */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cédula de Identidad</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      name="cedula"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Ej: 0991234567"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / Celular</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="tel" 
                      name="telefono"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Ej: 0987654321"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico (Opcional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="email" 
                      name="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="juan@email.com"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Fecha Nacimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="date" 
                      name="fecha_nacimiento"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-600"
                      onChange={handleChange}
                    />
                  </div>
                </div>

              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <Link 
                  to="/" 
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </Link>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-200 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Save size={20} />
                  Guardar Paciente
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NuevoPaciente;