import { useState } from "react";
import { Link } from "react-router-dom";
import imagenDefecto from "../assets/material_imagen_defecto.png";

export interface MaterialProp {
  id_material: number;
  nombre_material: string;
  imagenUrl?: string;
  precio_material?: string;
  tipo_unidad_material?: string;
  estado_material?: string;
  nombre_tipo_material?: string;
  cantidad_material?: number;
  descripcion_material?: string;
  estado_publicacion_material?: string;
  fecha_publicacion_material?: string;
  imagenes?: [{id_imagen:number,url_imagen:string}],
  latitud_publicacion_material?: string;
  longitud_publicacion_material?: string;
  ubicacion_material?: string;
}

export interface MaterialProps {
  material: MaterialProp;
  onSave?: (id_material: number) => void;
}

const Material = ({ material, onSave }: MaterialProps) => {
  // Definir el tipo de estado explícitamente como 'boolean'
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveMaterial = () => {
    // Cambiar el estado cuando se hace clic
    setIsSaved((prevState: boolean) => !prevState); 
    if(onSave) onSave(material.id_material);
  };

  const handleAddToCart = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
    const materialExistente = carritoActual.find(
      (item: MaterialProp) => item.id_material === material.id_material
    );

    if (materialExistente) {
      alert("Este material ya está en el carrito de compras.");
      return;
    }

    const nuevoCarrito = [...carritoActual, material];
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    alert("Producto añadido exitosamente al carrito de compras.");
  };

  return (
    <div className="relative flex-shrink-0 transform transition-colors hover:bg-slate-50 bg-white shadow-lg rounded-2xl p-6 w-60 md:w-64 lg:w-72">
      <div className="relative">
        {/* Botón de guardar */}
        <div className="absolute top-1 right-2">
          <button
            onClick={handleSaveMaterial}
            className={`p-2 rounded-full transition-colors ${isSaved ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
            </svg>
          </button>
        </div>
        <Link to={"/material/" + material.id_material}>
          <img
            className="w-full h-36 md:h-52 object-cover rounded-xl md:rounded-2xl"
            src={material.imagenUrl || imagenDefecto}
            alt={"imagen de " + material.nombre_material}
          />
        </Link>
      </div>

      <p className="font-semibold">Bs.{material.precio_material}</p>
      <p>{material.nombre_material}</p>
      <p className="font-semibold text-orange-600">
        Estado: {material.estado_material}
      </p>
      <p className="font-semibold text-blue-600">
        Medida: {material.tipo_unidad_material}
      </p>

      <button
        onClick={handleAddToCart}
        className="mt-3 px-4 py-2 bg-[#FDBC3F] text-white rounded-lg hover:bg-orange-500 w-full"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default Material;