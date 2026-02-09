import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { Users, Search, Plus, FileText, Edit, Trash2 } from 'lucide-react'; // Agregamos iconos nuevos
import Layout from '../components/Layout';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
}

function Pacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [token] = useState(localStorage.getItem('token'));

  // Cargar pacientes al inicio
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/pacientes/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => setPacientes(data));
  }, [token]);

  // FUNCIÓN PARA ELIMINAR (Lógica nueva)
  const eliminarPaciente = async (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de ELIMINAR al paciente "${nombre}"? \nEsta acción borrará todo su historial y NO se puede deshacer.`)) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          // Si se borró bien, lo quitamos de la lista visualmente sin recargar
          setPacientes(pacientes.filter(p => p.id !== id));
          alert("Paciente eliminado correctamente.");
        } else {
          alert("No se pudo eliminar.");
        }
      } catch (error) {
        alert("Error de conexión.");
      }
    }
  };

  // Filtrar por búsqueda
  const pacientesFiltrados = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.cedula.includes(busqueda)
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO Y BUSCADOR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-600" /> Pacientes
            </h1>
            <p className="text-gray-500 text-sm">Administra tu lista de expedientes.</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Buscar por nombre o cédula..." 
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <Link to="/pacientes/nuevo" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-blue-200">
              <Plus size={20} /> Nuevo
            </Link>
          </div>
        </div>

        {/* TABLA DE PACIENTES */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Paciente</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Cédula</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Teléfono</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((paciente) => (
                    <tr key={paciente.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{paciente.nombre}</div>
                        <div className="text-xs text-gray-400">{paciente.email}</div>
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-sm">{paciente.cedula}</td>
                      <td className="p-4 text-gray-600 text-sm">{paciente.telefono}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* BOTÓN EDITAR (LÁPIZ) */}
                          <button 
                            onClick={() => navigate(`/pacientes/editar/${paciente.id}`)}
                            className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>

                          {/* BOTÓN ELIMINAR (BASURA) */}
                          <button 
                            onClick={() => eliminarPaciente(paciente.id, paciente.nombre)}
                            className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                          {/* BOTÓN VER FICHA (AZUL) */}
                          <Link 
                            to={`/pacientes/${paciente.id}`} 
                            className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition"
                          >
                            <FileText size={16} /> Ver Ficha
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No se encontraron pacientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Pacientes;