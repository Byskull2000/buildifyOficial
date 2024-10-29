// src/components/DireccionesEntrega.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DireccionesEntrega: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/nueva-direccion")}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
    >
      Agregar Ubicación de Entrega
    </button>
  );
};

export default DireccionesEntrega;
