import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Diente from '../components/Diente';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
}

// Estado base de un diente limpio
const dienteVacio = { superior: 'white', inferior: 'white', izquierda: 'white', derecha: 'white', centro: 'white' };

function DetallePaciente() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  
  // ESTADOS DEL ODONTOGRAMA
  const [herramienta, setHerramienta] = useState<string>('red'); 
  const [estadoDientes, setEstadoDientes] = useState<any>({});
  const [nota, setNota] = useState(""); 

  // --- 1. CARGAR DATOS AL INICIO ---
  useEffect(() => {
    // A. Cargar datos del paciente
    fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`)
      .then((res) => res.json())
      .then((data) => setPaciente(data));

    // B. Cargar el último odontograma guardado
    fetch(`http://127.0.0.1:8000/api/tratamientos/?paciente=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const ultimoTratamiento = data[0];
          console.log("Cargando historial:", ultimoTratamiento);
          if (ultimoTratamiento.odontograma) {
            setEstadoDientes(ultimoTratamiento.odontograma);
          }
          if (ultimoTratamiento.descripcion) {
             setNota(ultimoTratamiento.descripcion);
          }
        }
      })
      .catch(err => console.error("Error cargando historial", err));
  }, [id]);

  // --- 2. FUNCIÓN PARA PINTAR ---
  const pintarDiente = (numero: number, parte: string) => {
    const key = `diente-${numero}`;
    const estadoActual = estadoDientes[key] || { ...dienteVacio };
    const nuevoEstado = { ...estadoActual, [parte]: herramienta };
    setEstadoDientes({ ...estadoDientes, [key]: nuevoEstado });
  };

  // --- 3. FUNCIÓN PARA GUARDAR ---
  const guardarTratamiento = async () => {
    if (!paciente) return;

    const datosAGuardar = {
      paciente: paciente.id,
      descripcion: nota || "Actualización de Odontograma",
      odontograma: estadoDientes,
      costo: 0
    };

    try {
      const respuesta = await fetch('http://127.0.0.1:8000/api/tratamientos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAGuardar)
      });

      if (respuesta.ok) {
        alert("¡Guardado correctamente! ✅");
      } else {
        alert("Error al guardar ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  if (!paciente) return <div className="text-center p-10">Cargando...</div>;

  // Listas de dientes
  const cuadrante1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const cuadrante2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const cuadrante4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const cuadrante3 = [31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link to="/" className="text-blue-600 hover:underline mr-4">← Volver</Link>
            <h1 className="text-3xl font-bold text-gray-800">Historia: {paciente.nombre}</h1>
          </div>
          <button 
            onClick={guardarTratamiento}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-lg transform hover:scale-105 transition"
          >
            💾 Guardar Cambios
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="font-bold text-blue-700 mb-4 border-b pb-2">Datos Personales</h2>
            <p><strong>Cédula:</strong> {paciente.cedula}</p>
            <p><strong>Teléfono:</strong> {paciente.telefono}</p>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            {/* Barra de Herramientas */}
            <div className="flex gap-4 mb-6 bg-gray-100 p-3 rounded-lg justify-center overflow-x-auto">
              <button onClick={() => setHerramienta('red')} className={`flex items-center gap-2 px-4 py-2 rounded font-bold whitespace-nowrap ${herramienta === 'red' ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-white text-gray-700'}`}>🔴 Caries</button>
              <button onClick={() => setHerramienta('blue')} className={`flex items-center gap-2 px-4 py-2 rounded font-bold whitespace-nowrap ${herramienta === 'blue' ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-white text-gray-700'}`}>🔵 Restaurado</button>
              <button onClick={() => setHerramienta('yellow')} className={`flex items-center gap-2 px-4 py-2 rounded font-bold whitespace-nowrap ${herramienta === 'yellow' ? 'bg-yellow-400 text-white ring-2 ring-yellow-300' : 'bg-white text-gray-700'}`}>🟡 Corona</button>
              <button onClick={() => setHerramienta('white')} className={`flex items-center gap-2 px-4 py-2 rounded font-bold whitespace-nowrap border ${herramienta === 'white' ? 'bg-gray-200 ring-2 ring-gray-400' : 'bg-white text-gray-700'}`}>⚪ Borrar</button>
            </div>

            {/* Mapa Dental */}
            <div className="flex flex-col gap-8 items-center overflow-x-auto pb-4 select-none">
              <div className="flex gap-4 sm:gap-8">
                <div className="flex gap-1 border-r-2 border-gray-300 pr-4">
                  {cuadrante1.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}
                </div>
                <div className="flex gap-1">
                  {cuadrante2.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}
                </div>
              </div>
              <div className="flex gap-4 sm:gap-8">
                <div className="flex gap-1 border-r-2 border-gray-300 pr-4">
                  {cuadrante4.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}
                </div>
                <div className="flex gap-1">
                  {cuadrante3.map(num => <Diente key={num} numero={num} colores={estadoDientes[`diente-${num}`] || dienteVacio} onClick={(parte) => pintarDiente(num, parte)} />)}
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <label className="block text-gray-700 font-bold mb-2">Nota de Evolución:</label>
              <textarea 
                className="w-full border p-3 rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Escribe aquí los detalles del tratamiento..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallePaciente;