import React, { useState, useRef } from 'react';

interface Material {
  id: number;
  name: string;
  icon: string;
  interested: boolean;
}

const InterestList: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: 'Ladrillo', icon: '🧱', interested: false },
    { id: 2, name: 'Cemento', icon: '🏗️', interested: false },
    { id: 3, name: 'Tablones', icon: '🪓', interested: false },
    { id: 4, name: 'Vigas', icon: '🔩', interested: false },
    { id: 5, name: 'Arena', icon: '🏖️', interested: false },
    { id: 6, name: 'Mezclas', icon: '🛠️', interested: false },
    { id: 7, name: 'Herramientas', icon: '🧰', interested: false },
    { id: 8, name: 'Madera', icon: '🌲', interested: false },
    { id: 9, name: 'Tejas', icon: '🏠', interested: false },
    { id: 10, name: 'Yeso', icon: '🏗️', interested: false },
    { id: 11, name: 'Piedras', icon: '⛰️', interested: false },
  ]);//para añadir materiales

  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckboxChange = (id: number) => {
    const updatedMaterials = materials.map((material) =>
      material.id === id ? { ...material, interested: !material.interested } : material
    );
    setMaterials(updatedMaterials);
    updateInterestInDB(id);
  };

  const updateInterestInDB = (id: number) => {
    const selectedMaterial = materials.find((material) => material.id === id);
    console.log(`Guardando en la base de datos: ${selectedMaterial?.name}, Interesado: ${selectedMaterial?.interested}`);
    
  };

  const shouldScroll = materials.length > 10; // Condición para mostrar scrollbar

  const userStorage =
  sessionStorage.getItem("user") || localStorage.getItem("user") || null;
  const user = userStorage ? JSON.parse(userStorage) : null;

  return (
    <div style={{ padding: '20px' }}>
      {user && (
       <> 
      <div style={detailsStyle} onClick={handleToggle}>
        <summary style={summaryStyle}>LISTA DE INTERESES</summary>
      </div>
      <div
        ref={contentRef}
        style={{
          ...curtainStyle,
          height: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
      >
        <ul style={{ ...listStyle, ...(shouldScroll ? scrollableStyle : {}) }}>
          {materials.map((material) => (
            <li
              key={material.id}
              style={itemStyle(material.interested)}
              onClick={() => handleCheckboxChange(material.id)}
            >
              <span style={{ marginRight: '10px' }}>{material.icon}</span>
              <span style={{ flexGrow: 1 }}>{material.name}</span>
              <input
                type="checkbox"
                checked={material.interested}
                onChange={() => handleCheckboxChange(material.id)}
                style={{ pointerEvents: 'none' }} 
              />
            </li>
          ))}
        </ul>
      </div>
       </>
      )}
    </div>
  );
};


const detailsStyle: React.CSSProperties = {
  width: '350px', 
  cursor: 'pointer',
  marginLeft: '0', 
};

const summaryStyle: React.CSSProperties = {
  backgroundColor: '#FFC107', 
  color: 'black',
  padding: '10px',
  borderRadius: '4px',
  userSelect: 'none',
  listStyle: 'none',
  textAlign: 'center',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%', 
};

const curtainStyle: React.CSSProperties = {
  overflow: 'hidden',
  transition: 'height 0.5s ease', // Transición de venta
};

const listStyle: React.CSSProperties = {
  listStyleType: 'none',
  padding: 0,
  margin: '0',
  backgroundColor: '#FFF8E1', 
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  opacity: 0.9,
  width: '350px', 
  height: '400px', 
  overflow: 'hidden', 
};


const scrollableStyle: React.CSSProperties = {
  maxHeight: '400px', 
  overflowY: 'auto', 
};


const itemStyle = (interested: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  borderBottom: '1px solid #ddd',
  backgroundColor: interested ? '#FFF176' : 'white', 
  transition: 'background-color 0.3s',
  cursor: 'pointer', 
  scrollbarWidth: 'thin', 
  scrollbarColor: '#FFC107 #FFF8E1', 
});

// Estilos personalizados del scrollbar 
const globalStyles = `
  ul::-webkit-scrollbar {
    width: 8px;
  }

  ul::-webkit-scrollbar-thumb {
    background-color: #FFC107; 
    border-radius: 10px;
  }

  ul::-webkit-scrollbar-track {
    background-color: #FFF8E1;
  }
`;


const injectGlobalStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
};


injectGlobalStyles();

export default InterestList;
