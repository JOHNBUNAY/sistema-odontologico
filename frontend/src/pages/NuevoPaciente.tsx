import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NuevoPaciente() {
  const navigate = useNavigate(); // Para redirigir al usuario después de guardar

  // 1. Guardamos los datos del formulario en el estado
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    fecha_nacimiento: ''
  });

  // 2. Función que maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    try {
      const response = await fetch('http://127.0.0.1:8000/api/pacientes/', {
        method: 'POST', // Le decimos a Django que vamos a CREAR algo
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Convertimos los datos a JSON
      });

      if (response.ok) {
        alert('¡Paciente registrado con éxito!');
        navigate('/'); // Volvemos a la lista principal
      } else {
        alert('Error al guardar. Revisa que la cédula no esté repetida.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  // 3. Función para actualizar el estado cuando escribes en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Registrar Nuevo Paciente
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
            <input 
              type="text" 
              name="nombre"
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Cédula */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Cédula</label>
            <input 
              type="text" 
              name="cedula"
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Fecha Nacimiento */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Nacimiento</label>
            <input 
              type="date" 
              name="fecha_nacimiento"
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

           {/* Teléfono */}
           <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
            <input 
              type="tel" 
              name="telefono"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between pt-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700 py-2">
              Cancelar
            </Link>
            <button 
              type="submit" 
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default NuevoPaciente