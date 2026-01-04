import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NuevoPaciente from './pages/NuevoPaciente';
import DetallePaciente from './pages/DetallePaciente';
import Agenda from './pages/Agenda';
import Login from './pages/Login';
import RutaProtegida from './components/RutaProtegida'; // <--- IMPORTANTE
import Pacientes from './pages/Pacientes';
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
        
        <Route path="/pacientes" element={
  <RutaProtegida>
    <Pacientes />  {/* <--- AHORA USA EL ARCHIVO CORRECTO */}
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

        {/* Si escriben cualquier cosa rara, mandar al inicio (que a su vez verificará el token) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App