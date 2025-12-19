import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

interface Cita {
  id: number;
  fecha_hora: string;
  motivo: string;
  estado: string; // 'PENDIENTE', 'COMPLETADA', 'CANCELADA'
  paciente: number; 
}

interface Paciente {
  id: number;
  nombre: string;
  telefono: string;
}

function Agenda() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Record<number, Paciente>>({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  // Cargar datos iniciales
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/citas/')
      .then(res => res.json())
      .then(data => setCitas(data));

    fetch('http://127.0.0.1:8000/api/pacientes/')
      .then(res => res.json())
      .then(data => {
        const mapa: Record<number, Paciente> = {};
        data.forEach((p: Paciente) => mapa[p.id] = p);
        setPacientes(mapa);
      });
  }, []);

  // --- FUNCIÓN NUEVA: CAMBIAR ESTADO ---
  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    // 1. Actualización Optimista (Visualmente inmediato)
    const citasActualizadas = citas.map(c => 
      c.id === id ? { ...c, estado: nuevoEstado } : c
    );
    setCitas(citasActualizadas);

    // 2. Guardar en Backend
    try {
      await fetch(`http://127.0.0.1:8000/api/citas/${id}/`, {
        method: 'PATCH', // PATCH sirve para editar solo un pedacito del dato
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (error) {
      alert("Error al actualizar la cita");
      console.error(error);
    }
  };

  const citasFiltradas = citas.filter(cita => 
    cita.fecha_hora.startsWith(fechaSeleccionada)
  ).sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime());

  const formatHora = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Ayuda visual para los colores
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADA': return 'bg-green-50 border-green-200';
      case 'CANCELADA': return 'bg-red-50 border-red-200 opacity-60';
      default: return 'bg-white border-gray-100';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="text-blue-600" size={28}/> Agenda Diaria
            </h1>
            <p className="text-gray-500">Gestiona el flujo de pacientes.</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600 pl-2">Ver día:</span>
            <input type="date" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} className="border-none outline-none text-gray-700 font-medium bg-transparent cursor-pointer"/>
          </div>
        </div>

        <div className="space-y-4">
          {citasFiltradas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4"/>
              <p className="text-gray-500 font-medium">Agenda libre</p>
              <p className="text-sm text-gray-400">No hay pacientes programados para esta fecha.</p>
            </div>
          ) : (
            citasFiltradas.map((cita) => {
              const paciente = pacientes[cita.paciente];
              const esCompletada = cita.estado === 'COMPLETADA';
              const esCancelada = cita.estado === 'CANCELADA';

              return (
                <div key={cita.id} className={`p-6 rounded-2xl shadow-sm border transition-all ${getEstadoColor(cita.estado)} flex items-center justify-between`}>
                  
                  <div className="flex items-center gap-6">
                    <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl ${esCompletada ? 'bg-green-100 text-green-700' : esCancelada ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                      <Clock size={24} className="mb-1"/>
                      <span className="text-lg font-bold">{formatHora(cita.fecha_hora)}</span>
                    </div>
                    
                    <div>
                      <h3 className={`text-xl font-bold ${esCancelada ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {paciente ? paciente.nombre : 'Cargando...'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">
                          <User size={14}/> {cita.motivo}
                        </span>
                        {/* Estado Etiqueta */}
                        {esCompletada && <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> Atendido</span>}
                        {esCancelada && <span className="text-red-500 font-bold flex items-center gap-1"><AlertCircle size={14}/> Cancelado</span>}
                      </div>
                    </div>
                  </div>

                  {/* BOTONES DE ACCIÓN (Solo se muestran si está PENDIENTE) */}
                  {!esCompletada && !esCancelada && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => cambiarEstado(cita.id, 'COMPLETADA')}
                        className="p-3 bg-white border border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-300 rounded-xl transition shadow-sm" 
                        title="Marcar como Atendido"
                      >
                        <CheckCircle size={24}/>
                      </button>
                      <button 
                        onClick={() => cambiarEstado(cita.id, 'CANCELADA')}
                        className="p-3 bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl transition shadow-sm" 
                        title="Cancelar Cita"
                      >
                        <XCircle size={24}/>
                      </button>
                    </div>
                  )}
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