import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search } from 'lucide-react';
import Layout from '../components/Layout';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
}

function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // Solo cargamos la lista de pacientes, nada más.
    fetch('http://127.0.0.1:8000/api/pacientes/')
      .then((res) => res.json())
      .then((data) => setPacientes(Array.isArray(data) ? data : []));
  }, []);

  const pacientesFiltrados = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.cedula.includes(busqueda)
  );

  return (
    <Layout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Directorio de Pacientes</h1>
          <p className="text-gray-500">Gestiona y busca expedientes clínicos.</p>
        </div>
        <Link to="/nuevo" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
          <UserPlus size={18} /> Nuevo Paciente
        </Link>
      </div>

      {/* BARRA DE BÚSQUEDA Y TABLA (Sin estadísticas) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">
            Listado Total <span className="text-sm font-normal text-gray-500 ml-2">({pacientes.length} pacientes)</span>
          </h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o cédula..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 transition-all bg-white"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Cédula</th>
                <th className="p-4 font-semibold">Teléfono</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pacientesFiltrados.length > 0 ? (
                pacientesFiltrados.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm">
                          {paciente.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                          {paciente.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm font-mono bg-gray-50/30 rounded-lg">{paciente.cedula}</td>
                    <td className="p-4 text-gray-500 text-sm">{paciente.telefono}</td>
                    <td className="p-4 text-center">
                      <Link 
                        to={`/pacientes/${paciente.id}`} 
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-4 py-2 rounded-lg transition-all"
                      >
                        Ver Ficha
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search size={48} className="mb-4 text-gray-200"/>
                      <p className="font-medium">No se encontraron pacientes.</p>
                      <p className="text-sm">Intenta con otro nombre o registra uno nuevo.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Pacientes;