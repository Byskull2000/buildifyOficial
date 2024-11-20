import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Categorias from "../components/Categorias";
import Material, { MaterialProp } from "../components/Material";
import { URL_BACKEND } from "../constant/url";

const MaterialesFiltrados = () => {
  const [materiales, setMateriales] = useState<MaterialProp[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id") || "";

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const response = await fetch(
          `${URL_BACKEND}/api/materiales/tipo/${id}`
        );
        const data = await response.json();
        setMateriales(data.data || []);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMateriales();
  }, [id]);

  return (
    <div>
      <Categorias />

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
        >
          Refrescar
        </button>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Inicio
        </button>
      </div>

      {/* Mensaje descriptivo */}
      <div className="text-center text-lg font-medium mt-4 text-gray-800 bg-[#FDBC3F] p-2 rounded-md shadow-md">
        Descubra los productos disponibles en esta categoría de materiales
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {materiales.length > 0 ? (
          materiales.map((material) => (
            <Material key={material.id_material} material={material} />
          ))
        ) : (
          <p className="text-center mt-4 text-gray-500">
            No se encontraron materiales para esta categoría.
          </p>
        )}
      </div>
    </div>
  );
};

export default MaterialesFiltrados;
