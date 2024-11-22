import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegistroRapidoPP from "../components/RegistroRapidoPP.tsx";
import buildifyLogo from "../assets/Buildify.png";
import fondoCarrito from "../assets/FondoCarrito.png"; // Imagen de fondo

export interface MaterialProp {
  id_material: number;
  nombre_material: string;
  imagenUrl?: string;
  precio_material: number;
  tipo_unidad_material?: string;
  estado_material?: string;
}

const CarritoCompras: React.FC = () => {
  const [materiales, setMateriales] = useState<MaterialProp[]>([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalPrecio, setTotalPrecio] = useState(0);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  const userStorage =
    sessionStorage.getItem("user") || localStorage.getItem("user") || null;
  const user = userStorage ? JSON.parse(userStorage) : null;

  const actualizarTotales = (carrito: MaterialProp[]) => {
    const totalProductos = carrito.length;
    const totalPrecio = carrito.reduce(
      (total, item) => total + Number(item.precio_material),
      0
    );

    setTotalProductos(totalProductos);
    setTotalPrecio(totalPrecio);
  };

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setMateriales(carrito);
    actualizarTotales(carrito);
  }, []);

  const handleRemove = (id: number) => {
    const nuevoCarrito = materiales.filter(
      (material) => material.id_material !== id
    );
    setMateriales(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    actualizarTotales(nuevoCarrito);
    setShowConfirmPopup(false);
  };

  const handleShowPopup = () => {
    setShowRegisterPopup(true);
  };

  const handleConfirmDelete = (id: number) => {
    setSelectedMaterialId(id);
    setShowConfirmPopup(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center py-10"
      style={{ backgroundImage: `url(${fondoCarrito})` }} // Fondo del carrito
    >
      {/* Botón con logo de Buildify */}
      <div className="flex items-center justify-between mb-6 bg-white bg-opacity-90 py-4 px-6 rounded-lg shadow-lg">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={buildifyLogo}
            alt="Logo de Buildify"
            className="h-14 w-14"
          />
          <h1 className="text-2xl font-black text-gray-800">Buildify</h1>
        </Link>
      </div>

      {/* Título del carrito */}
      <h2 className="text-4xl font-bold text-gray-800 bg-white bg-opacity-90 py-2 px-4 rounded-lg shadow-md mb-8">
        🛒 Carrito de Compras
      </h2>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row gap-8 bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-11/12 max-w-5xl">
        {/* Lista de materiales */}
        <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-inner">
          {materiales.length === 0 ? (
            <p className="text-gray-500 text-lg text-center">
              Tu carrito está vacío.
            </p>
          ) : (
            materiales.map((material) => (
              <div
                key={material.id_material}
                className="flex items-center justify-between mb-6 border-b pb-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={material.imagenUrl}
                  alt={material.nombre_material}
                  className="w-24 h-24 rounded-lg object-cover shadow-lg"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {material.nombre_material}
                  </h3>
                  <p className="text-gray-600">
                    Estado: {material.estado_material}
                  </p>
                  <p className="text-gray-600">
                    Medida: {material.tipo_unidad_material}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Bs. {material.precio_material}
                  </p>
                </div>
                <button
                  onClick={() => handleConfirmDelete(material.id_material)}
                  className="text-sm px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-transform transform hover:scale-105"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Resumen del carrito */}
        {materiales.length > 0 && (
          <div className="md:w-1/3 p-6 bg-[#FDBC3F] rounded-lg shadow-lg text-white">
            <h3 className="text-2xl font-semibold mb-4">Resumen de Compra</h3>
            <p className="text-lg">
              <span className="font-semibold">Cant. Productos:</span>
              <span className="float-right font-bold">{totalProductos}</span>
            </p>
            <p className="text-lg mt-2">
              <span className="font-semibold">Precio Total:</span>
              <span className="float-right font-bold">
                Bs. {totalPrecio.toFixed(2)}
              </span>
            </p>
            {user ? (
              <button
                onClick={() => {
                  localStorage.setItem("carrito", JSON.stringify(materiales));
                  navigate("/confirmar-pedido");
                }}
                className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
              >
                Proceder con la Compra
              </button>
            ) : (
              <button
                onClick={handleShowPopup}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
              >
                Antes de continuar debes registrarte
              </button>
            )}
          </div>
        )}
      </div>

      {/* Popup de registro rápido */}
      {showRegisterPopup && (
        <RegistroRapidoPP
          isOpen={showRegisterPopup}
          setIsOpen={setShowRegisterPopup}
        />
      )}

      {/* Popup de confirmación */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ¿Estás seguro de eliminar este producto del carrito?
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleRemove(selectedMaterialId!)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Sí
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoCompras;
