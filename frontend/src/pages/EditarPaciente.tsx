import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// CORRECCIÓN: Quité 'MapPin' de aquí porque no se usaba
import { Save, X, User, Users, ShieldCheck, PenTool } from 'lucide-react';
import Layout from '../components/Layout';

function EditarPaciente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [token] = useState(localStorage.getItem('token'));
  const [cargando, setCargando] = useState(true);
  
  // Estado para el checkbox
  const [tieneRepresentante, setTieneRepresentante] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    fecha_nacimiento: '',
    sexo: 'M',
    direccion: '',
    ocupacion: '',
    // Apoderado
    tiene_representante: false,
    rep_nombres: '',
    rep_apellidos: '',
    rep_relacion: '',
    rep_tipo_documento: 'CEDULA',
    rep_cedula: '',
    rep_email: '',
    rep_telefono: '',
    rep_direccion: ''
  });

  // 1. CARGAR DATOS AL INICIAR
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        setFormData(data);
        setTieneRepresentante(data.tiene_representante);
        setCargando(false);
    })
    .catch(() => alert("Error al cargar paciente"));
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTieneRepresentante(checked);
    setFormData({ ...formData, tiene_representante: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // USAMOS PUT PARA ACTUALIZAR
      const response = await fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("¡Datos actualizados correctamente!");
        navigate(`/pacientes`); // Volver a la lista general (o al detalle si prefieres)
      } else {
        alert("Error al actualizar. Revisa los datos.");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  if (cargando) return <Layout><div className="p-10 text-center">Cargando datos...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PenTool className="text-blue-600" size={28}/> Editar Paciente: {formData.nombre}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TARJETA 1: DATOS DEL PACIENTE */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 border-b pb-4 mb-6 flex items-center gap-2 text-lg">
              <User className="text-blue-500" size={20}/> Datos Personales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label><input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label><input type="text" name="cedula" required value={formData.cedula} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label><select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 outline-none"><option value="M">Masculino</option><option value="F">Femenino</option><option value="O">Otro</option></select></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label><input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 outline-none" /></div>
              </div>
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label><input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label><input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 outline-none" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 outline-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label><textarea name="direccion" rows={2} value={formData.direccion} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50 outline-none"></textarea></div>
              </div>
            </div>
          </div>

          {/* TARJETA 2: REPRESENTANTE */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <input type="checkbox" id="checkRep" checked={tieneRepresentante} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"/>
              <label htmlFor="checkRep" className="font-bold text-gray-700 cursor-pointer select-none flex items-center gap-2"><Users size={20} className="text-purple-600"/> ¿Editar Apoderado / Representante?</label>
            </div>
            {tieneRepresentante && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
                <h3 className="font-bold text-purple-700 mb-4 flex items-center gap-2"><ShieldCheck size={18}/> Datos del Responsable Legal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Relación</label><input type="text" name="rep_relacion" value={formData.rep_relacion || ''} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Cédula Rep.</label><input type="text" name="rep_cedula" value={formData.rep_cedula || ''} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Teléfono Rep.</label><input type="text" name="rep_telefono" value={formData.rep_telefono || ''} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Nombres</label><input type="text" name="rep_nombres" value={formData.rep_nombres || ''} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Apellidos</label><input type="text" name="rep_apellidos" value={formData.rep_apellidos || ''} onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-white" /></div>
                </div>
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/pacientes')} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 flex items-center gap-2"><X size={20}/> Cancelar</button>
            <button type="submit" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"><Save size={20}/> Guardar Cambios</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
export default EditarPaciente;