import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NuevoPaciente from './pages/NuevoPaciente';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: Muestra la lista */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Ruta nueva: Muestra el formulario */}
        <Route path="/nuevo" element={<NuevoPaciente />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App