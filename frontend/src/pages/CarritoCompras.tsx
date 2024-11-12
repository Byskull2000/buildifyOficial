import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        🛒 Carrito de Compras
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
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
                className="flex items-center justify-between mb-6 border-b pb-4"
              >
                <img
                  src={material.imagenUrl}
                  alt={material.nombre_material}
                  className="w-24 h-24 rounded-lg object-cover"
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
                  onClick={() => handleRemove(material.id_material)}
                  className="text-sm px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Resumen del carrito */}
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

          {/* Botón de proceder o registro */}
          {user ? (
            <button className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Proceder con la Compra
            </button>
          ) : (
            <button
              onClick={handleRegisterRedirect}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Antes de continuar debes registrarte
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarritoCompras;
