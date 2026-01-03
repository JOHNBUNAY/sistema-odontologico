import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface RutaProtegidaProps {
  children: ReactNode;
}

function RutaProtegida({ children }: RutaProtegidaProps) {
  // 1. Buscamos la "pulsera" en el bolsillo del navegador
  const token = localStorage.getItem('token');

  // 2. Si NO hay token, lo mandamos al Login ("¡Alto ahí!")
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si SÍ hay token, lo dejamos pasar
  return <>{children}</>;
}

export default RutaProtegida;