import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NuevoPaciente from './pages/NuevoPaciente';
import DetallePaciente from './pages/DetallePaciente';
import Agenda from './pages/Agenda';
import Login from './pages/Login';
import RutaProtegida from './components/RutaProtegida'; // <--- IMPORTANTE
import Pacientes from './pages/Pacientes';

import EditarPaciente from './pages/EditarPaciente';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA (Cualquiera puede entrar) */}
        <Route path="/login" element={<Login />} />
        
        {/* RUTAS PRIVADAS (Solo con llave) */}
        <Route path="/" element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        } />
        
        <Route path="/nuevo" element={
          <RutaProtegida>
            <NuevoPaciente />
          </RutaProtegida>
        } />
        <Route path="/pacientes/editar/:id" element={<EditarPaciente />} />
        <Route path="/pacientes" element={
  <RutaProtegida>
    <Pacientes />  
  </RutaProtegida>
} />
        
        <Route path="/pacientes/:id" element={
          <RutaProtegida>
            <DetallePaciente />
          </RutaProtegida>
        } />
        
        <Route path="/agenda" element={
          <RutaProtegida>
            <Agenda />
          </RutaProtegida>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App