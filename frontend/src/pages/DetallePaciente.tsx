import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// LIMPIEZA: Borré Trash2, Edit, CheckSquare, Square y useNavigate porque ya no se usan aquí.
import { ArrowLeft, Save, Calendar, Activity, Phone, CreditCard, User, AlertTriangle, Thermometer, Heart, Wind, Stethoscope, MessageSquare, Info, X, MapPin, Mail, ShieldCheck } from 'lucide-react';
import Layout from '../components/Layout';
import Diente from '../components/Diente';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  sexo: string;
  direccion: string;
  ocupacion: string;
  tiene_representante: boolean;
  rep_nombres: string;
  rep_apellidos: string;
  rep_relacion: string;
  rep_cedula: string;
  rep_telefono: string;
  
  // Sección 1 y 2
  motivo_consulta: string;
  enfermedad_actual: string;
  // Antecedentes
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
  // Sección 5
  labios: boolean;
  mejillas: boolean;
  maxilar_superior: boolean;
  maxilar_inferior: boolean;
  lengua: boolean;
  paladar: boolean;
  piso_boca: boolean;
  carrillos: boolean;
  glandulas_salivales: boolean;
  orofaringe: boolean;
  atm: boolean;
  ganglios: boolean;
  descripcion_estomatognatico: string;
}

interface Tratamiento {
  id: number;
  fecha: string;
  descripcion: string;
  odontograma: any;
}

const dienteVacio = { superior: 'white', inferior: 'white', izquierda: 'white', derecha: 'white', centro: 'white' };

function DetallePaciente() {
  // LIMPIEZA: Borré 'navigate' porque aquí solo visualizamos
  const { id } = useParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [token] = useState(localStorage.getItem('token'));
  
  const [mostrarFicha, setMostrarFicha] = useState(false);
  const [herramienta, setHerramienta] = useState<string>('red'); 
  const [estadoDientes, setEstadoDientes] = useState<any>({});
  const [nota, setNota] = useState(""); 
  const [historial, setHistorial] = useState<Tratamiento[]>([]);
  
  const [presion, setPresion] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [pulso, setPulso] = useState("");
  const [respiracion, setRespiracion] = useState("");

  const [descEstoma, setDescEstoma] = useState("");
  const [motivoTexto, setMotivoTexto] = useState(""); 
  const [enfermedadTexto, setEnfermedadTexto] = useState("");

  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [motivoCita, setMotivoCita] = useState("");

  const cargarDatos = () => {
    fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setPaciente(data);
        setDescEstoma(data.descripcion_estomatognatico || "");
        setMotivoTexto(data.motivo_consulta || ""); 
        setEnfermedadTexto(data.enfermedad_actual || "");
      });

    fetch(`http://127.0.0.1:8000/api/tratamientos/?paciente=${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
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

  // LIMPIEZA: Borré la función eliminarPaciente() porque el botón ya no está aquí.

  const pintarDiente = (numero: number, parte: string) => {
    const key = `diente-${numero}`;
    const estadoActual = estadoDientes[key] || { ...dienteVacio };
    const nuevoEstado = { ...estadoActual, [parte]: herramienta };
    setEstadoDientes({ ...estadoDientes, [key]: nuevoEstado });
  };

  const toggleCampo = async (campo: keyof Paciente) => {
    if (!paciente) return;
    const nuevoValor = !paciente[campo];
    const pacienteActualizado = { ...paciente, [campo]: nuevoValor };
    setPaciente(pacienteActualizado);
    try {
      await fetch(`http://127.0.0.1:8000/api/pacientes/${paciente.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ [campo]: nuevoValor })
      });
    } catch (error) { alert("Error al guardar cambio"); }
  };

  const guardarTexto = async (campo: string, valor: string) => {
    if (!paciente) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/pacientes/${paciente.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ [campo]: valor })
      });
    } catch (e) { console.error(e); }
  };

  const guardarTratamiento = async () => {
    if (!paciente || !nota.trim()) return alert("⚠️ Escribe una nota antes de guardar.");
    let textoSignos = "";
    if (presion || temperatura || pulso || respiracion) {
      textoSignos = `[Signos: PA:${presion || '--'} | T:${temperatura || '--'}°C | FC:${pulso || '--'} | FR:${respiracion || '--'}] \n`;
    }
    const notaFinal = textoSignos + nota;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/tratamientos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          paciente: paciente.id,
          descripcion: notaFinal,
          odontograma: estadoDientes,
          costo: 0
        })
      });
      if (res.ok) {
        alert("¡Evolución guardada! 💾");
        setNota(""); setPresion(""); setTemperatura(""); setPulso(""); setRespiracion("");
        cargarDatos();
      }
    } catch (e) { alert("Error de conexión"); }
  };

  const agendarCita = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/citas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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

  const listaAntecedentes = [
    { key: 'alergia_antibioticos', label: '1. Alergia Antibiótico' },
    { key: 'alergia_anestesia', label: '2. Alergia Anestesia' },
    { key: 'hemorragias', label: '3. Hemorragias' },
    { key: 'vih_sida', label: '4. VIH / SIDA' },
    { key: 'tuberculosis', label: '5. Tuberculosis' },
    { key: 'asma', label: '6. Asma' },
    { key: 'diabetes', label: '7. Diabetes' },
    { key: 'hipertension', label: '8. Hipertensión' },
    { key: 'enfermedad_cardiaca', label: '9. Enf. Cardíaca' },
    { key: 'otros_antecedentes', label: '10. Otro', isCheck: false }
  ];

  const listaEstomatognatico = [
    { key: 'labios', label: '1. Labios' }, { key: 'mejillas', label: '2. Mejillas' },
    { key: 'maxilar_superior', label: '3. Maxilar Sup.' }, { key: 'maxilar_inferior', label: '4. Maxilar Inf.' },
    { key: 'lengua', label: '5. Lengua' }, { key: 'paladar', label: '6. Paladar' },
    { key: 'piso_boca', label: '7. Piso Boca' }, { key: 'carrillos', label: '8. Carrillos' },
    { key: 'glandulas_salivales', label: '9. Gland. Salivales' }, { key: 'orofaringe', label: '10. Oro Faringe' },
    { key: 'atm', label: '11. A.T.M' }, { key: 'ganglios', label: '12. Ganglios' },
  ];

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
            <Link to="/pacientes" className="p-2 rounded-full hover:bg-gray-200 transition text-gray-600"><ArrowLeft size={24} /></Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User size={24} className="text-blue-600"/> {paciente.nombre}
              </h1>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><CreditCard size={14}/> {paciente.cedula || <span className="text-gray-300 italic">S/N</span>}</span>
                <span className="flex items-center gap-1"><Phone size={14}/> {paciente.telefono || <span className="text-gray-300 italic">S/N</span>}</span>
                <button onClick={() => setMostrarFicha(true)} className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 ml-2 underline">
                    <Info size={14}/> Ver Ficha Completa
                </button>
              </div>
            </div>
          </div>
          <button onClick={guardarTratamiento} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-green-200 flex items-center gap-2 hover:scale-105 transition-transform">
            <Save size={20} /> Guardar Evolución
          </button>
        </div>

        {/* MODAL FICHA DE FILIACIÓN */}
        {mostrarFicha && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                        <h2 className="font-bold text-lg flex items-center gap-2"><User size={20}/> Ficha de Filiación</h2>
                        <button onClick={() => setMostrarFicha(false)} className="hover:bg-gray-700 p-1 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="text-blue-600 font-bold border-b pb-1 text-sm uppercase">Datos Personales</h3>
                            <p className="text-sm text-gray-600"><strong className="text-gray-800">Nombre:</strong> {paciente.nombre}</p>
                            <p className="text-sm text-gray-600"><strong className="text-gray-800">Cédula:</strong> {paciente.cedula}</p>
                            <p className="text-sm text-gray-600"><strong className="text-gray-800">Sexo:</strong> {paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'Otro'}</p>
                            <p className="text-sm text-gray-600"><strong className="text-gray-800">Fecha Nac:</strong> {paciente.fecha_nacimiento}</p>
                            <p className="text-sm text-gray-600"><strong className="text-gray-800">Ocupación:</strong> {paciente.ocupacion}</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-blue-600 font-bold border-b pb-1 text-sm uppercase">Contacto</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2"><Phone size={14}/> {paciente.telefono}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-2"><Mail size={14}/> {paciente.email}</p>
                            <p className="text-sm text-gray-600 flex items-start gap-2"><MapPin size={14} className="mt-1"/> {paciente.direccion}</p>
                        </div>
                        
                        {paciente.tiene_representante && (
                            <div className="col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-100 mt-2">
                                <h3 className="text-purple-700 font-bold border-b border-purple-200 pb-1 text-sm uppercase flex items-center gap-2 mb-2">
                                    <ShieldCheck size={16}/> Apoderado / Responsable
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <p className="text-sm text-gray-600"><strong className="text-gray-800">Nombre:</strong> {paciente.rep_nombres} {paciente.rep_apellidos}</p>
                                    <p className="text-sm text-gray-600"><strong className="text-gray-800">Relación:</strong> {paciente.rep_relacion}</p>
                                    <p className="text-sm text-gray-600"><strong className="text-gray-800">Cédula:</strong> {paciente.rep_cedula}</p>
                                    <p className="text-sm text-gray-600"><strong className="text-gray-800">Teléfono:</strong> {paciente.rep_telefono}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-50 text-right">
                        <button onClick={() => setMostrarFicha(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium">Cerrar</button>
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* 1. MOTIVO CONSULTA */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                <MessageSquare className="text-blue-500" size={20}/> 1. Motivo Consulta
              </h2>
              <textarea 
                placeholder="Anexar la queja del problema..." 
                className="w-full text-sm p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                rows={3}
                value={motivoTexto}
                onChange={(e) => setMotivoTexto(e.target.value)}
                onBlur={() => guardarTexto('motivo_consulta', motivoTexto)}
              ></textarea>
            </div>

            {/* 2. ENFERMEDAD ACTUAL */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                <Activity className="text-blue-500" size={20}/> 2. Enfermedad o Problema Actual
              </h2>
              <p className="text-xs text-gray-400 mb-2 italic">Registrar: Cronología, localización, características, intensidad, causa aparente, síntomas asociados.</p>
              <textarea 
                placeholder="Describir la evolución clínica..." 
                className="w-full text-sm p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                rows={4} 
                value={enfermedadTexto}
                onChange={(e) => setEnfermedadTexto(e.target.value)}
                onBlur={() => guardarTexto('enfermedad_actual', enfermedadTexto)}
              ></textarea>
            </div>

            {/* 3. ANTECEDENTES */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                <AlertTriangle className="text-orange-500" size={20}/> 3. Antecedentes Personales
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {listaAntecedentes.map((item) => (
                   item.isCheck !== false ? (
                    <div 
                      key={item.key} 
                      onClick={() => toggleCampo(item.key as keyof Paciente)} 
                      className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                        // @ts-ignore
                        paciente[item.key] ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{item.label}</span>
                      {/* @ts-ignore */}
                      <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${paciente[item.key] ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'}`}>
                        {/* @ts-ignore */}
                        {paciente[item.key] && <span className="text-white text-[8px]">✓</span>}
                      </div>
                    </div>
                   ) : null
                ))}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 mb-1 block uppercase">Observaciones / Otros:</label>
                <textarea 
                  placeholder="Describir antecedentes positivos..." 
                  className="w-full text-sm p-2 border rounded-lg bg-yellow-50/50 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  rows={2}
                  defaultValue={paciente.otros_antecedentes || ""}
                  onBlur={(e) => guardarTexto('otros_antecedentes', e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* 5. ESTOMATOGNÁTICO */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Stethoscope className="text-purple-500" size={20}/> 5. Estomatognático
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {listaEstomatognatico.map((item) => (
                  <div key={item.key} onClick={() => toggleCampo(item.key as keyof Paciente)} className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer border transition-all ${
                      // @ts-ignore
                      paciente[item.key] ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-transparent hover:border-gray-200'
                    }`}>
                    <span className={`text-xs font-bold text-center ${
                      // @ts-ignore
                      paciente[item.key] ? 'text-red-600' : 'text-gray-500'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
              <textarea 
                placeholder="Describir patología..." 
                className="w-full text-xs p-2 border rounded-lg bg-gray-50 focus:ring-1 focus:ring-purple-500 outline-none"
                rows={3}
                value={descEstoma}
                onChange={(e) => setDescEstoma(e.target.value)}
                onBlur={() => guardarTexto('descripcion_estomatognatico', descEstoma)}
              ></textarea>
            </div>

            {/* CITA */}
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

          {/* COLUMNA DERECHA */}
          <div className="xl:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex flex-wrap gap-2 mb-6 justify-center bg-gray-50 p-3 rounded-xl">
              {[{ id: 'red', label: 'Caries', color: 'bg-red-500' }, { id: 'blue', label: 'Restaurado', color: 'bg-blue-500' }, { id: 'yellow', label: 'Corona', color: 'bg-yellow-400' }, { id: 'green', label: 'Extracción', color: 'bg-green-500' }].map((tool) => (
                <button key={tool.id} onClick={() => setHerramienta(tool.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${herramienta === tool.id ? `${tool.color} text-white shadow-md` : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                  <div className={`w-2 h-2 rounded-full ${tool.color}`}></div> {tool.label}
                </button>
              ))}
            </div>
            
            {/* ODONTOGRAMA */}
            <div className="overflow-x-auto pb-4 select-none border-b border-gray-100 mb-6 px-4">
              <div className="min-w-max mx-auto flex flex-col gap-6">
                <div className="flex gap-4 pb-4 border-b border-dashed border-gray-200">
                  <div className="flex gap-1 border-r border-gray-300 pr-4">{cuadrante1.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}</div>
                  <div className="flex gap-1">{cuadrante2.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}</div>
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-1 border-r border-gray-300 pr-4">{cuadrante4.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}</div>
                  <div className="flex gap-1">{cuadrante3.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
                <Activity size={16}/> 4. Signos Vitales
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><label className="text-xs text-gray-500 mb-1 block">Presión</label><div className="relative"><input type="text" placeholder="120/80" className="w-full p-2 pl-7 border rounded text-sm" value={presion} onChange={e => setPresion(e.target.value)} /><Activity className="absolute left-2 top-2.5 text-gray-400" size={14} /></div></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Temp</label><div className="relative"><input type="number" placeholder="36.5" className="w-full p-2 pl-7 border rounded text-sm" value={temperatura} onChange={e => setTemperatura(e.target.value)} /><Thermometer className="absolute left-2 top-2.5 text-gray-400" size={14} /></div></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Pulso</label><div className="relative"><input type="number" placeholder="80" className="w-full p-2 pl-7 border rounded text-sm" value={pulso} onChange={e => setPulso(e.target.value)} /><Heart className="absolute left-2 top-2.5 text-gray-400" size={14} /></div></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Resp.</label><div className="relative"><input type="number" placeholder="20" className="w-full p-2 pl-7 border rounded text-sm" value={respiracion} onChange={e => setRespiracion(e.target.value)} /><Wind className="absolute left-2 top-2.5 text-gray-400" size={14} /></div></div>
              </div>
            </div>
            <textarea className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600 bg-gray-50 h-24" placeholder="Nota de evolución..." value={nota} onChange={(e) => setNota(e.target.value)}></textarea>
          </div>

          <div className="xl:col-span-3 bg-white p-0 rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl"><h2 className="font-bold text-gray-800 flex items-center gap-2"><Activity className="text-blue-500" size={20}/> Historial</h2></div>
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