import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: <LayoutDashboard size={20} /> },
    { path: '/pacientes', label: 'Pacientes', icon: <Users size={20} /> },
    { path: '/agenda', label: 'Agenda', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* SIDEBAR IZQUIERDO */}
      <aside className="w-64 bg-white shadow-xl flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Users size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">DentalApp</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;