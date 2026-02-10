import { useEffect, useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

interface Cita {
  id: number;
  fecha_hora: string;
  motivo: string;
  estado: string; 
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
  
  // Usamos un objeto Date real para manejar mejor la navegación
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

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

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    const citasActualizadas = citas.map(c => 
      c.id === id ? { ...c, estado: nuevoEstado } : c
    );
    setCitas(citasActualizadas);

    try {
      await fetch(`http://127.0.0.1:8000/api/citas/${id}/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (error) {
      alert("Error al actualizar la cita");
    }
  };

  // --- NAVEGACIÓN DE FECHAS ---
  const cambiarDia = (dias: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(fechaSeleccionada.getDate() + dias);
    setFechaSeleccionada(nuevaFecha);
  };

  const fechaString = fechaSeleccionada.toISOString().split('T')[0];

  const citasFiltradas = citas.filter(cita => 
    cita.fecha_hora.startsWith(fechaString)
  ).sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime());

  // --- ESTADÍSTICAS RÁPIDAS ---
  const stats = {
    total: citasFiltradas.length,
    pendientes: citasFiltradas.filter(c => c.estado === 'PENDIENTE').length,
    completadas: citasFiltradas.filter(c => c.estado === 'COMPLETADA').length
  };

  const formatHora = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFechaBonita = (date: Date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO Y CONTROLES (MODIFICADO) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="text-blue-600" size={28}/> Agenda Diaria
            </h1>
            <p className="text-gray-500 capitalize">{formatFechaBonita(fechaSeleccionada)}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* NAVEGACIÓN DE DÍAS */}
            <div className="flex items-center bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
                <button onClick={() => cambiarDia(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition">
                <ChevronLeft size={20}/>
                </button>
                <div className="px-4 font-bold text-gray-700 min-w-[140px] text-center">
                {fechaString}
                </div>
                <button onClick={() => cambiarDia(1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition">
                <ChevronRight size={20}/>
                </button>
            </div>

            {/* BOTÓN PERMANENTE DE AGENDAR (NUEVO) */}
            <Link to="/pacientes" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-transform hover:scale-105">
                <PlusCircle size={20}/> <span className="hidden md:inline">Agendar Cita</span>
            </Link>
          </div>
        </div>

        {/* BARRA DE ESTADÍSTICAS */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl flex items-center justify-center gap-2 border border-blue-100 font-medium">
              <CalendarIcon size={18}/> {stats.total} Citas Totales
            </div>
            <div className="bg-orange-50 text-orange-700 p-3 rounded-xl flex items-center justify-center gap-2 border border-orange-100 font-medium">
              <Clock size={18}/> {stats.pendientes} Pendientes
            </div>
            <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center justify-center gap-2 border border-green-100 font-medium">
              <CheckCircle size={18}/> {stats.completadas} Atendidas
            </div>
          </div>
        )}

        {/* LISTA DE CITAS */}
        <div className="space-y-4">
          {citasFiltradas.length === 0 ? (
            // EMPTY STATE
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon size={32} className="text-gray-300"/>
              </div>
              <h3 className="text-lg font-bold text-gray-700">Día libre</h3>
              <p className="text-gray-400 mb-6">No hay pacientes agendados para este día.</p>
              
              {/* Botón extra en el centro (opcional, lo dejé por comodidad) */}
              <Link to="/pacientes" className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
               <PlusCircle size={18}/> Agendar primer paciente
              </Link>
            </div>
          ) : (
            // LISTA DE TARJETAS
            citasFiltradas.map((cita) => {
              const paciente = pacientes[cita.paciente];
              const esCompletada = cita.estado === 'COMPLETADA';
              const esCancelada = cita.estado === 'CANCELADA';

              const bordeColor = esCompletada ? 'border-l-green-500' : esCancelada ? 'border-l-red-300' : 'border-l-blue-500';
              const bgOpacity = esCancelada ? 'opacity-60 bg-gray-50' : 'bg-white';

              return (
                <div key={cita.id} className={`group relative p-5 rounded-xl shadow-sm border border-gray-100 ${bordeColor} border-l-[6px] transition-all hover:shadow-md ${bgOpacity}`}>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {/* Hora */}
                      <div className="flex flex-col items-center justify-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-lg font-bold text-gray-800">{formatHora(cita.fecha_hora)}</span>
                        <span className="text-xs text-gray-500 uppercase">Hora</span>
                      </div>

                      {/* Datos */}
                      <div>
                        <h3 className={`text-lg font-bold ${esCancelada ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {paciente ? paciente.nombre : 'Cargando...'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">{cita.motivo}</span>
                          {paciente && <span className="flex items-center gap-1"><User size={12}/> {paciente.telefono}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Estado / Acciones */}
                    <div className="flex items-center gap-2">
                        {esCompletada && <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Finalizado</span>}
                        {esCancelada && <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14}/> Cancelado</span>}
                        
                        {!esCompletada && !esCancelada && (
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => cambiarEstado(cita.id, 'COMPLETADA')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Completar"><CheckCircle size={20}/></button>
                           <button onClick={() => cambiarEstado(cita.id, 'CANCELADA')} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Cancelar"><XCircle size={20}/></button>
                         </div>
                        )}
                    </div>
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