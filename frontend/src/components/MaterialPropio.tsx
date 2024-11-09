// MaterialPropio.tsx
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import imagenDefecto from "../assets/material_imagen_defecto.png";
import FormEliminacion from "../components/formEliminacion";

// Definimos y exportamos MaterialProp aquí
export interface MaterialProp {
  id_material: number;
  nombre_material: string;
  imagenUrl?: string;
  precio_material: number;
  estado_publicacion_material?: string;
}

const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

const Material = ({ material }: { material: MaterialProp }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [estadoMaterial, setEstadoMaterial] = useState(
    material.estado_publicacion_material || "activo"
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  const marcarInactivo = async () => {
    try {
      const response = await fetch(
        `${URL_BACKEND}/api/marcar-inactivo/${material.id_material}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) setEstadoMaterial("inactivo");
    } catch (error) {
      console.error("Error al desactivar el material:", error);
    }
  };

  const marcarActivo = async () => {
    try {
      const response = await fetch(
        `${URL_BACKEND}/api/marcar-activo/${material.id_material}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) setEstadoMaterial("activo");
    } catch (error) {
      console.error("Error al activar el material:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative flex-shrink-0 transform transition-colors hover:bg-slate-50 bg-white shadow-lg rounded-2xl p-6 w-60 md:w-64 lg:w-72"
    >
      <div
        className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full ${estadoMaterial === "Activo" || estadoMaterial === "activo" 
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
          }`}
      >
        {estadoMaterial === "Activo" || estadoMaterial === "activo"? "Activo" : "Inactivo"}
      </div>

      <Link to={`/material/${material.id_material}`}>
        <img
          className="w-full h-32 md:h-40 lg:h-48 object-cover rounded-lg"
          src={material.imagenUrl || imagenDefecto}
          alt={"imagen de " + material.nombre_material}
        />
        <p className="font-semibold mt-3 text-lg text-gray-800">
          Bs.{material.precio_material}
        </p>
        <p className="text-gray-700 text-sm">{material.nombre_material}</p>
      </Link>

      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>

      {menuOpen && (
        <div className="absolute top-10 right-2 bg-white border border-gray-300 rounded shadow-lg py-1 w-28">
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              navigate(`/editarMaterial/${material.id_material}`);
              setMenuOpen(false);
            }}
          >
            Editar
          </button>
          {estadoMaterial === "activo" || estadoMaterial === "Activo" ? (
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => {
                togglePopup();
                setMenuOpen(false);
              }}
            >
              Desactivar
            </button>
          ) : (
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => {
                marcarActivo();
                setMenuOpen(false);
              }}
            >
              Activar
            </button>
          )}
        </div>
      )}

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <FormEliminacion
            onConfirm={() => {
              marcarInactivo();
              togglePopup();
            }}
            onCancel={togglePopup}
          />
          <button
            onClick={togglePopup}
            className="absolute top-0 right-0 m-4 text-white bg-red-600 p-2 rounded-full hover:bg-red-800"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      )}


    </div>
  );
};

export default Material;
