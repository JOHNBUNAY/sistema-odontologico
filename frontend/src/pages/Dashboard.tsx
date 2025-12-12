import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Users, CalendarCheck, Activity } from 'lucide-react';
import Layout from '../components/Layout'; // <--- Importamos el nuevo Layout

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
}

function Dashboard() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/pacientes/')
      .then((res) => res.json())
      .then((data) => setPacientes(Array.isArray(data) ? data : []));
  }, []);

  // Filtramos pacientes por nombre en tiempo real
  const pacientesFiltrados = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.cedula.includes(busqueda)
  );

  return (
    <Layout>
      {/* 1. HEADER Y BIENVENIDA */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel Principal</h1>
          <p className="text-gray-500">Bienvenido de nuevo, Doctor(a).</p>
        </div>
        <Link 
          to="/nuevo" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <UserPlus size={18} />
          Nuevo Paciente
        </Link>
      </div>

      {/* 2. TARJETAS DE RESUMEN (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Pacientes</p>
            <h3 className="text-2xl font-bold text-gray-800">{pacientes.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Citas Hoy</p>
            <h3 className="text-2xl font-bold text-gray-800">4</h3> {/* Dato simulado por ahora */}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Tratamientos Mes</p>
            <h3 className="text-2xl font-bold text-gray-800">12</h3> {/* Dato simulado por ahora */}
          </div>
        </div>
      </div>

      {/* 3. BARRA DE BÚSQUEDA Y TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Pacientes Recientes</h2>
          
          {/* Input de Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o cédula..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all"
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
                  <tr key={paciente.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {paciente.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          {paciente.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm font-mono">{paciente.cedula}</td>
                    <td className="p-4 text-gray-500 text-sm">{paciente.telefono}</td>
                    <td className="p-4 text-center">
                      <Link 
                        to={`/pacientes/${paciente.id}`} 
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Ver Ficha
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    No se encontraron pacientes.
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

export default Dashboard;