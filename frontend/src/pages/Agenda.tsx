import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../components/Layout';

interface Cita {
  id: number;
  fecha_hora: string;
  motivo: string;
  estado: string;
  paciente: number; // Django nos devuelve solo el ID por defecto
}

interface Paciente {
  id: number;
  nombre: string;
  telefono: string;
}

function Agenda() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Record<number, Paciente>>({});
  
  // Fecha seleccionada (Por defecto HOY)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // 1. Cargar Citas
    fetch('http://127.0.0.1:8000/api/citas/')
      .then(res => res.json())
      .then(data => setCitas(data));

    // 2. Cargar Pacientes (Para saber el nombre de quien tiene la cita)
    // Nota: En una app real, esto se optimiza en el backend, pero para aprender lo haremos así.
    fetch('http://127.0.0.1:8000/api/pacientes/')
      .then(res => res.json())
      .then(data => {
        const mapaPacientes: Record<number, Paciente> = {};
        data.forEach((p: Paciente) => mapaPacientes[p.id] = p);
        setPacientes(mapaPacientes);
      });
  }, []);

  // Filtrar citas por la fecha seleccionada
  const citasFiltradas = citas.filter(cita => 
    cita.fecha_hora.startsWith(fechaSeleccionada)
  ).sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime());

  // Función para formatear la hora (ej: 14:30)
  const formatHora = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="text-blue-600" size={28}/>
              Agenda Diaria
            </h1>
            <p className="text-gray-500">Gestiona las citas programadas.</p>
          </div>
          
          {/* SELECTOR DE FECHA */}
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600 pl-2">Ver día:</span>
            <input 
              type="date" 
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="border-none outline-none text-gray-700 font-medium bg-transparent cursor-pointer"
            />
          </div>
        </div>

        {/* LISTA DE CITAS */}
        <div className="space-y-4">
          {citasFiltradas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4"/>
              <p className="text-gray-500 font-medium">No hay citas programadas para este día.</p>
              <p className="text-sm text-gray-400">Selecciona otra fecha o agenda una nueva cita desde Pacientes.</p>
            </div>
          ) : (
            citasFiltradas.map((cita) => {
              const paciente = pacientes[cita.paciente];
              return (
                <div key={cita.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  
                  {/* HORA Y ESTADO */}
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 w-20 h-20 rounded-xl">
                      <Clock size={24} className="mb-1"/>
                      <span className="text-lg font-bold">{formatHora(cita.fecha_hora)}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {paciente ? paciente.nombre : 'Cargando...'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                          <User size={14}/> {cita.motivo}
                        </span>
                        {paciente && (
                          <span className="flex items-center gap-1 text-blue-500">
                            <Phone size={14}/> {paciente.telefono}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="flex gap-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Marcar como Completada">
                      <CheckCircle size={24}/>
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Cancelar Cita">
                      <XCircle size={24}/>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </Layout>
  );
}

export default Agenda;