import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import buildifyLogo from "../../assets/Buildify.png";
import FondoGuardado from "../../assets/FondoGuardado.png";
import { MaterialProp } from "../../components/Material";

const ListaGuardados = () => {
  const [savedProducts, setSavedProducts] = useState<MaterialProp[]>([]);
  const [markedForDelete, setMarkedForDelete] = useState<number[]>([]); // IDs marcados para eliminar
  const [deleting, setDeleting] = useState<number | null>(null); // Publicación en proceso de eliminación
  const navigate = useNavigate();

  useEffect(() => {
    const publicacionesGuardadas = JSON.parse(
      localStorage.getItem("publicacionesGuardadas") || "[]"
    );
    setSavedProducts(publicacionesGuardadas);
  }, []);

  const markForDelete = (id_material: number) => {
    setMarkedForDelete((prev) => [...prev, id_material]);
  };

  const undoDelete = (id_material: number) => {
    setMarkedForDelete((prev) => prev.filter((id) => id !== id_material));
  };

  const handleRemoveProduct = (id_material: number) => {
    setDeleting(id_material); // Activar animación de eliminación
    setTimeout(() => {
      // Esperar la animación antes de eliminar
      const nuevasPublicaciones = savedProducts.filter(
        (item) => item.id_material !== id_material
      );
      localStorage.setItem(
        "publicacionesGuardadas",
        JSON.stringify(nuevasPublicaciones)
      );
      setSavedProducts(nuevasPublicaciones);
      setMarkedForDelete((prev) => prev.filter((id) => id !== id_material));
      setDeleting(null); // Eliminar referencia de animación
    }, 500); // Duración de la animación
  };

  const handleViewPublication = (id_material: number) => {
    navigate(`/material/${id_material}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-10 px-4 flex flex-col items-center"
      style={{ backgroundImage: `url(${FondoGuardado})` }}
    >
      {/* Botón con logo de Buildify */}
      <div className="flex items-center justify-between bg-white bg-opacity-90 py-4 px-6 rounded-lg shadow-lg mb-8">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={buildifyLogo}
            alt="Logo de Buildify"
            className="h-14 w-14"
          />
          <h1 className="text-2xl font-black text-gray-800">Buildify</h1>
        </Link>
      </div>

      {/* Título del apartado */}
      <h2 className="text-4xl font-bold text-gray-800 bg-white bg-opacity-90 py-2 px-4 rounded-lg shadow-md mb-8">
        🗂️ Publicaciones Guardadas
      </h2>

      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-4xl">
        {savedProducts.length === 0 ? (
          <p className="text-center text-gray-500">La lista está vacía</p>
        ) : (
          savedProducts.map((product) => (
            <div
              key={product.id_material}
              className={`flex items-start p-4 mb-4 rounded-lg shadow ${
                deleting === product.id_material
                  ? "opacity-0 scale-90 transition-all duration-500 ease-out" // Animación de eliminación
                  : markedForDelete.includes(product.id_material)
                  ? "bg-gray-200 opacity-50"
                  : "bg-gray-50 hover:shadow-lg transform transition-all duration-200"
              }`}
            >
              <div className="flex-shrink-0 w-36 h-36 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={product.imagenUrl || "https://via.placeholder.com/150"}
                  alt={product.nombre_material}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 ml-5">
                <h3 className="text-lg font-semibold">
                  {product.nombre_material}
                </h3>
                <p className="text-sm text-gray-700">
                  Bs. {product.precio_material}
                </p>
                <p className="text-sm text-gray-600">
                  {product.descripcion_material}
                </p>
                <button
                  onClick={() => handleViewPublication(product.id_material)}
                  className="px-4 py-2 mt-2 text-sm font-semibold text-white bg-[#e3961b] rounded-md hover:bg-orange-600 transition duration-200"
                >
                  Ver Publicación
                </button>
              </div>
              <div className="ml-auto">
                {markedForDelete.includes(product.id_material) ? (
                  <>
                    <button
                      onClick={() => handleRemoveProduct(product.id_material)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Eliminar definitivamente
                    </button>
                    <button
                      onClick={() => undoDelete(product.id_material)}
                      className="px-4 py-2 ml-2 text-sm font-semibold text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => markForDelete(product.id_material)}
                    className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow hover:bg-orange-600 transition duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-black"
                    >
                      <path d="M5 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v18l-7-3-7 3V4z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListaGuardados;
