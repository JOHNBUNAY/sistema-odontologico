import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NuevoPaciente from './pages/NuevoPaciente';
import DetallePaciente from './pages/DetallePaciente'; // <--- ¡ESTA LÍNEA FALTABA!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: Muestra la lista */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Ruta nueva: Muestra el formulario */}
        <Route path="/nuevo" element={<NuevoPaciente />} />
        
        {/* Ruta detalle: Muestra la ficha del paciente */}
        <Route path="/pacientes/:id" element={<DetallePaciente />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App