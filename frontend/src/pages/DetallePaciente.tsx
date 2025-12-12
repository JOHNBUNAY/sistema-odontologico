import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Clock, FileText, Activity, Trash2, Phone, CreditCard, User } from 'lucide-react';
import Layout from '../components/Layout';
import Diente from '../components/Diente';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
}

interface Tratamiento {
  id: number;
  fecha: string;
  descripcion: string;
  odontograma: any;
}

const dienteVacio = { superior: 'white', inferior: 'white', izquierda: 'white', derecha: 'white', centro: 'white' };

function DetallePaciente() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  
  // ESTADOS
  const [herramienta, setHerramienta] = useState<string>('red'); 
  const [estadoDientes, setEstadoDientes] = useState<any>({});
  const [nota, setNota] = useState(""); 
  const [historial, setHistorial] = useState<Tratamiento[]>([]);

  // ESTADOS CITA
  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [motivoCita, setMotivoCita] = useState("");

  const cargarDatos = () => {
    fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`)
      .then((res) => res.json())
      .then((data) => setPaciente(data));

    fetch(`http://127.0.0.1:8000/api/tratamientos/?paciente=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistorial(data);
          if (data.length > 0 && data[0].odontograma) {
            setEstadoDientes(data[0].odontograma);
          }
        }
      });
  };

  useEffect(() => { cargarDatos(); }, [id]);

  const pintarDiente = (numero: number, parte: string) => {
    const key = `diente-${numero}`;
    const estadoActual = estadoDientes[key] || { ...dienteVacio };
    const nuevoEstado = { ...estadoActual, [parte]: herramienta };
    setEstadoDientes({ ...estadoDientes, [key]: nuevoEstado });
  };

  const guardarTratamiento = async () => {
    if (!paciente || !nota.trim()) return alert("⚠️ Escribe una nota antes de guardar.");
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tratamientos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente: paciente.id,
          descripcion: nota,
          odontograma: estadoDientes,
          costo: 0
        })
      });
      if (res.ok) {
        alert("¡Evolución guardada! 💾");
        setNota("");
        cargarDatos();
      }
    } catch (e) { alert("Error de conexión"); }
  };

  const agendarCita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaCita || !horaCita || !motivoCita) return alert("Llena todos los campos");
    try {
      const res = await fetch('http://127.0.0.1:8000/api/citas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente: paciente?.id,
          fecha_hora: `${fechaCita}T${horaCita}:00`,
          motivo: motivoCita,
          estado: 'PENDIENTE'
        })
      });
      if (res.ok) {
        alert("📅 ¡Cita agendada con éxito!");
        setFechaCita(""); setHoraCita(""); setMotivoCita("");
      }
    } catch (e) { alert("Error de conexión"); }
  };

  if (!paciente) return <Layout><div className="p-10 text-center">Cargando...</div></Layout>;

  // Cuadrantes
  const cuadrante1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const cuadrante2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const cuadrante4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const cuadrante3 = [31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-200 transition text-gray-600">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User size={24} className="text-blue-600"/> 
                {paciente.nombre}
              </h1>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><CreditCard size={14}/> {paciente.cedula}</span>
                <span className="flex items-center gap-1"><Phone size={14}/> {paciente.telefono}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={guardarTratamiento}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-green-200 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save size={20} />
            Guardar Evolución
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA: Citas + Historial */}
          <div className="space-y-6">
            
            {/* AGENDAR CITA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-blue-500" size={20}/>
                Nueva Cita
              </h2>
              <form onSubmit={agendarCita} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input type="date" value={fechaCita} onChange={e => setFechaCita(e.target.value)} className="w-full p-2 pl-8 border rounded-lg text-sm bg-gray-50" required />
                    <Calendar className="absolute left-2 top-2.5 text-gray-400" size={14}/>
                  </div>
                  <div className="relative">
                    <input type="time" value={horaCita} onChange={e => setHoraCita(e.target.value)} className="w-full p-2 pl-8 border rounded-lg text-sm bg-gray-50" required />
                    <Clock className="absolute left-2 top-2.5 text-gray-400" size={14}/>
                  </div>
                </div>
                <input type="text" placeholder="Motivo de consulta..." value={motivoCita} onChange={e => setMotivoCita(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-gray-50" required />
                <button type="submit" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-2 rounded-lg text-sm transition">
                  Agendar
                </button>
              </form>
            </div>

            {/* HISTORIAL CLÍNICO */}
            <div className="bg-white p-0 rounded-2xl shadow-sm border border-gray-100 h-[500px] flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="text-orange-500" size={20}/>
                  Historial Clínico
                </h2>
              </div>
              <div className="overflow-y-auto p-4 space-y-4 flex-1">
                {historial.length === 0 ? (
                  <p className="text-gray-400 text-center text-sm py-10">Sin historial previo.</p>
                ) : (
                  historial.map((item) => (
                    <div key={item.id} className="relative pl-4 border-l-2 border-blue-100 pb-4 last:pb-0">
                      <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                      <p className="text-xs text-gray-400 font-mono mb-1">{item.fecha}</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {item.descripcion}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: ODONTOGRAMA */}
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            
            {/* HERRAMIENTAS */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center bg-gray-50 p-4 rounded-xl">
              {[
                { id: 'red', label: 'Caries', color: 'bg-red-500' },
                { id: 'blue', label: 'Restaurado', color: 'bg-blue-500' },
                { id: 'yellow', label: 'Corona', color: 'bg-yellow-400' },
                { id: 'green', label: 'Extracción', color: 'bg-green-500' },
              ].map((tool) => (
                <button 
                  key={tool.id}
                  onClick={() => setHerramienta(tool.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    herramienta === tool.id 
                      ? `${tool.color} text-white shadow-md scale-105` 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                  {tool.label}
                </button>
              ))}
              <button 
                onClick={() => setHerramienta('white')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  herramienta === 'white' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Trash2 size={16}/> Borrar
              </button>
            </div>

            {/* MAPA DENTAL */}
            <div className="flex flex-col gap-6 items-center overflow-x-auto pb-4 select-none">
              <div className="flex gap-8 pb-4 border-b border-dashed border-gray-200">
                <div className="flex gap-1 border-r border-gray-300 pr-6">
                  {cuadrante1.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}
                </div>
                <div className="flex gap-1">
                  {cuadrante2.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex gap-1 border-r border-gray-300 pr-6">
                  {cuadrante4.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}
                </div>
                <div className="flex gap-1">
                  {cuadrante3.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}
                </div>
              </div>
            </div>
            
            {/* CAMPO DE NOTA */}
            <div className="mt-8">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-blue-500"/>
                Nota de Evolución
              </label>
              <textarea 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-600 bg-gray-50 h-32"
                placeholder="Describe el procedimiento realizado..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              ></textarea>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DetallePaciente;