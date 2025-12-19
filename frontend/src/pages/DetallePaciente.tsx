import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Activity, Phone, CreditCard, User, AlertTriangle, CheckSquare, Square, Thermometer, Heart, Wind } from 'lucide-react';
import Layout from '../components/Layout';
import Diente from '../components/Diente';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  alergia_antibioticos: boolean;
  alergia_anestesia: boolean;
  hemorragias: boolean;
  vih_sida: boolean;
  tuberculosis: boolean;
  asma: boolean;
  diabetes: boolean;
  hipertension: boolean;
  enfermedad_cardiaca: boolean;
  otros_antecedentes: string;
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
  
  // ESTADOS ODONTOGRAMA
  const [herramienta, setHerramienta] = useState<string>('red'); 
  const [estadoDientes, setEstadoDientes] = useState<any>({});
  const [nota, setNota] = useState(""); 
  const [historial, setHistorial] = useState<Tratamiento[]>([]);

  // ESTADOS SIGNOS VITALES (Formulario 033 - Sección 4)
  const [presion, setPresion] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [pulso, setPulso] = useState("");
  const [respiracion, setRespiracion] = useState("");

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

  const toggleAntecedente = async (campo: keyof Paciente) => {
    if (!paciente) return;
    const nuevoValor = !paciente[campo];
    const pacienteActualizado = { ...paciente, [campo]: nuevoValor };
    setPaciente(pacienteActualizado);
    try {
      await fetch(`http://127.0.0.1:8000/api/pacientes/${paciente.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [campo]: nuevoValor })
      });
    } catch (error) { alert("Error al guardar antecedente"); }
  };

  const pintarDiente = (numero: number, parte: string) => {
    const key = `diente-${numero}`;
    const estadoActual = estadoDientes[key] || { ...dienteVacio };
    const nuevoEstado = { ...estadoActual, [parte]: herramienta };
    setEstadoDientes({ ...estadoDientes, [key]: nuevoEstado });
  };

  const guardarTratamiento = async () => {
    if (!paciente || !nota.trim()) return alert("⚠️ Escribe una nota antes de guardar.");
    
    // --- MAGIA: Unimos los Signos Vitales a la nota automáticamente ---
    let textoSignos = "";
    if (presion || temperatura || pulso || respiracion) {
      textoSignos = `[Signos: PA:${presion || '--'} | T:${temperatura || '--'}°C | FC:${pulso || '--'} | FR:${respiracion || '--'}] \n`;
    }
    const notaFinal = textoSignos + nota;
    // ------------------------------------------------------------------

    try {
      const res = await fetch('http://127.0.0.1:8000/api/tratamientos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente: paciente.id,
          descripcion: notaFinal,
          odontograma: estadoDientes,
          costo: 0
        })
      });
      if (res.ok) {
        alert("¡Evolución guardada con Signos Vitales! 🩺");
        setNota("");
        setPresion(""); setTemperatura(""); setPulso(""); setRespiracion(""); // Limpiar campos
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
        alert("📅 ¡Cita agendada!");
        setFechaCita(""); setHoraCita(""); setMotivoCita("");
      }
    } catch (e) { alert("Error de conexión"); }
  };

  if (!paciente) return <Layout><div className="p-10 text-center">Cargando...</div></Layout>;

  const cuadrante1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const cuadrante2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const cuadrante4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const cuadrante3 = [31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-200 transition text-gray-600">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User size={24} className="text-blue-600"/> {paciente.nombre}
              </h1>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><CreditCard size={14}/> {paciente.cedula}</span>
                <span className="flex items-center gap-1"><Phone size={14}/> {paciente.telefono}</span>
              </div>
            </div>
          </div>
          <button onClick={guardarTratamiento} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-green-200 flex items-center gap-2 transition-transform active:scale-95">
            <Save size={20} /> Guardar Evolución
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA (Datos + Antecedentes) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <AlertTriangle className="text-orange-500" size={20}/> Alerta Médica
              </h2>
              <div className="space-y-3">
                {[{ key: 'alergia_antibioticos', label: 'Alergia Antibióticos' }, { key: 'alergia_anestesia', label: 'Alergia Anestesia' }, { key: 'hipertension', label: 'Hipertensión' }, { key: 'diabetes', label: 'Diabetes' }, { key: 'hemorragias', label: 'Hemorragias' }].map((item) => (
                  <div key={item.key} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      // @ts-ignore 
                      paciente[item.key] ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'}`} 
                      // @ts-ignore
                      onClick={() => toggleAntecedente(item.key)}>
                    <span className={`text-sm font-medium ${
                      // @ts-ignore
                      paciente[item.key] ? 'text-red-700' : 'text-gray-600'}`}>{item.label}</span>
                    {/* @ts-ignore */}
                    {paciente[item.key] ? <CheckSquare className="text-red-600" size={20} /> : <Square className="text-gray-300" size={20} />}
                  </div>
                ))}
              </div>
            </div>
            {/* Cita */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-blue-500" size={20}/> Nueva Cita
              </h2>
              <form onSubmit={agendarCita} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={fechaCita} onChange={e => setFechaCita(e.target.value)} className="w-full p-2 border rounded-lg text-xs bg-gray-50" required />
                  <input type="time" value={horaCita} onChange={e => setHoraCita(e.target.value)} className="w-full p-2 border rounded-lg text-xs bg-gray-50" required />
                </div>
                <input type="text" placeholder="Motivo..." value={motivoCita} onChange={e => setMotivoCita(e.target.value)} className="w-full p-2 border rounded-lg text-xs bg-gray-50" required />
                <button type="submit" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-2 rounded-lg text-xs transition">Agendar</button>
              </form>
            </div>
          </div>

          {/* COLUMNA CENTRAL (Odontograma + Signos Vitales) */}
          <div className="xl:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             {/* Herramientas */}
             <div className="flex flex-wrap gap-2 mb-6 justify-center bg-gray-50 p-3 rounded-xl">
              {[{ id: 'red', label: 'Caries', color: 'bg-red-500' }, { id: 'blue', label: 'Restaurado', color: 'bg-blue-500' }, { id: 'yellow', label: 'Corona', color: 'bg-yellow-400' }, { id: 'green', label: 'Extracción', color: 'bg-green-500' }].map((tool) => (
                <button key={tool.id} onClick={() => setHerramienta(tool.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${herramienta === tool.id ? `${tool.color} text-white shadow-md` : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                  <div className={`w-2 h-2 rounded-full ${tool.color}`}></div> {tool.label}
                </button>
              ))}
            </div>

            {/* Odontograma */}
            <div className="flex flex-col gap-6 items-center overflow-x-auto pb-4 select-none border-b border-gray-100 mb-6">
              <div className="flex gap-4 pb-4 border-b border-dashed border-gray-200">
                <div className="flex gap-1 border-r border-gray-300 pr-4">{cuadrante1.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}</div>
                <div className="flex gap-1">{cuadrante2.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}</div>
              </div>
              <div className="flex gap-4">
                <div className="flex gap-1 border-r border-gray-300 pr-4">{cuadrante4.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}</div>
                <div className="flex gap-1">{cuadrante3.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}</div>
              </div>
            </div>

            {/* --- SIGNOS VITALES (Form. 033 Sección 4) --- */}
            <div className="mb-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
                <Activity size={16}/> Signos Vitales (Visita Actual)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Presión (PA)</label>
                  <div className="relative">
                    <input type="text" placeholder="120/80" className="w-full p-2 pl-7 border rounded text-sm" value={presion} onChange={e => setPresion(e.target.value)} />
                    <Activity className="absolute left-2 top-2.5 text-gray-400" size={14} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Temp (°C)</label>
                  <div className="relative">
                    <input type="number" placeholder="36.5" className="w-full p-2 pl-7 border rounded text-sm" value={temperatura} onChange={e => setTemperatura(e.target.value)} />
                    <Thermometer className="absolute left-2 top-2.5 text-gray-400" size={14} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Pulso (FC)</label>
                  <div className="relative">
                    <input type="number" placeholder="80" className="w-full p-2 pl-7 border rounded text-sm" value={pulso} onChange={e => setPulso(e.target.value)} />
                    <Heart className="absolute left-2 top-2.5 text-gray-400" size={14} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Resp. (FR)</label>
                  <div className="relative">
                    <input type="number" placeholder="20" className="w-full p-2 pl-7 border rounded text-sm" value={respiracion} onChange={e => setRespiracion(e.target.value)} />
                    <Wind className="absolute left-2 top-2.5 text-gray-400" size={14} />
                  </div>
                </div>
              </div>
            </div>
            {/* ------------------------------------------- */}
            
            <div className="mt-4">
              <textarea className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600 bg-gray-50 h-24" placeholder="Nota de evolución..." value={nota} onChange={(e) => setNota(e.target.value)}></textarea>
            </div>
          </div>

          {/* COLUMNA DERECHA (Historial) */}
          <div className="xl:col-span-3 bg-white p-0 rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
              <h2 className="font-bold text-gray-800 flex items-center gap-2"><Activity className="text-blue-500" size={20}/> Historial</h2>
            </div>
            <div className="overflow-y-auto p-4 space-y-4 flex-1">
              {historial.map((item) => (
                <div key={item.id} className="relative pl-4 border-l-2 border-blue-100 pb-4 last:pb-0">
                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <p className="text-xs text-gray-400 font-mono mb-1">{item.fecha}</p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 whitespace-pre-line">{item.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DetallePaciente;