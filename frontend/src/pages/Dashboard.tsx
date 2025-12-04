import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
}

function Dashboard() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/pacientes/')
      .then((response) => response.json())
      .then((data) => {
        setPacientes(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error cargando pacientes:", error);
        setCargando(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado con el botón de Nuevo Paciente */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">
            🦷 Lista de Pacientes
          </h1>
          <Link to="/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold shadow-md transition">
            + Nuevo Paciente
          </Link>
        </div>

        {cargando ? (
          <p className="text-center text-gray-500">Cargando datos...</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Cédula</th>
                  <th className="py-3 px-4 text-left">Teléfono</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {pacientes.map((paciente) => (
                  <tr key={paciente.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{paciente.nombre}</td>
                    <td className="py-3 px-4">{paciente.cedula}</td>
                    <td className="py-3 px-4">{paciente.telefono}</td>
                    <td className="py-3 px-4 text-center">
                      {/* AQUÍ ESTÁ EL ARREGLO DEL BOTÓN VER FICHA */}
                      <Link 
                        to={`/pacientes/${paciente.id}`} 
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mr-2 inline-block"
                      >
                        Ver Ficha
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {pacientes.length === 0 && (
              <p className="text-center p-4 text-gray-500">No hay pacientes registrados aún.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard