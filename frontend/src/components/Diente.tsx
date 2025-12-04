import React from 'react';

interface DienteProps {
  numero: number;
  // Ahora recibimos los colores de cada parte
  colores: {
    superior: string;
    inferior: string;
    izquierda: string;
    derecha: string;
    centro: string;
  };
  onClick: (parte: string) => void;
}

const Diente: React.FC<DienteProps> = ({ numero, colores, onClick }) => {
  return (
    <div className="flex flex-col items-center m-1">
      <span className="text-xs font-bold text-gray-600 mb-1 select-none">{numero}</span>
      
      <svg width="40" height="40" viewBox="0 0 100 100" className="cursor-pointer hover:scale-110 transition">
        
        {/* 1. Cara SUPERIOR */}
        <polygon 
          points="0,0 100,0 75,25 25,25" 
          fill={colores.superior || 'white'} stroke="black" strokeWidth="1"
          onClick={() => onClick('superior')}
        />

        {/* 2. Cara INFERIOR */}
        <polygon 
          points="0,100 100,100 75,75 25,75" 
          fill={colores.inferior || 'white'} stroke="black" strokeWidth="1"
          onClick={() => onClick('inferior')}
        />

        {/* 3. Cara IZQUIERDA */}
        <polygon 
          points="0,0 0,100 25,75 25,25" 
          fill={colores.izquierda || 'white'} stroke="black" strokeWidth="1"
          onClick={() => onClick('izquierda')}
        />

        {/* 4. Cara DERECHA */}
        <polygon 
          points="100,0 100,100 75,75 75,25" 
          fill={colores.derecha || 'white'} stroke="black" strokeWidth="1"
          onClick={() => onClick('derecha')}
        />

        {/* 5. Cara CENTRAL */}
        <rect 
          x="25" y="25" width="50" height="50" 
          fill={colores.centro || 'white'} stroke="black" strokeWidth="1"
          onClick={() => onClick('centro')}
        />
        
      </svg>
    </div>
  );
};

export default Diente;