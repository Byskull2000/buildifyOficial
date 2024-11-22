import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialProp } from "./CarritoCompras";
import buildifyLogo from "../assets/Buildify.png"; // Logo de Buildify
import fondoConfirmarPedido from "../assets/FondoConfirmarPedido.png"; // Fondo del apartado

const ConfirmarPedido: React.FC = () => {
  const [materiales, setMateriales] = useState<MaterialProp[]>([]);
  const [totalPrecio, setTotalPrecio] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setMateriales(carrito);
    const total = carrito.reduce(
      (sum: number, item: MaterialProp) => sum + Number(item.precio_material),
      0
    );
    setTotalPrecio(total);
  }, []);

  const handleProcederPago = () => {
    if (metodoPago === "tarjeta") {
      navigate("/pago-tarjeta");
    } else if (metodoPago === "qr") {
      navigate("/pago-qr");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-10 px-4 flex flex-col items-center"
      style={{ backgroundImage: `url(${fondoConfirmarPedido})` }}
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
        🛒 Confirmar Pedido
      </h2>

      {/* Resumen de la compra */}
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-4xl mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Resumen de Compra
        </h3>
        {materiales.map((material) => (
          <div
            key={material.id_material}
            className="flex items-center justify-between mb-6 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex-1">
              <h4 className="text-lg font-bold text-blue-800">
                {material.nombre_material}
              </h4>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Estado:</span>{" "}
                {material.estado_material}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Medida:</span>{" "}
                {material.tipo_unidad_material}
              </p>
              <p className="text-lg font-semibold text-green-700">
                Precio: Bs. {material.precio_material}
              </p>
            </div>
            <img
              src={material.imagenUrl}
              alt={material.nombre_material}
              className="w-24 h-24 rounded-lg object-cover shadow-md"
            />
          </div>
        ))}
        <div className="text-right mt-4">
          <p className="text-lg font-bold text-gray-800">
            Total a pagar:
            <span className="text-2xl text-red-600 ml-2">
              Bs. {totalPrecio.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-4xl mb-8 text-center">
        <label
          htmlFor="metodoPago"
          className="block text-lg font-semibold mb-4 text-gray-800"
        >
          Selecciona un método de pago:
        </label>
        <select
          id="metodoPago"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="w-2/3 p-3 border rounded-lg shadow-md text-gray-700 transition-transform transform hover:scale-105"
        >
          <option value="" disabled>
            Elige un método
          </option>
          <option value="tarjeta">Tarjeta de Débito/Crédito</option>
          <option value="qr">QR Simple</option>
        </select>
      </div>

      {/* Botón de continuar */}
      {metodoPago && (
        <button
          onClick={handleProcederPago}
          className="bg-[#FCA61E] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#e58d1a] transition-transform transform hover:scale-105"
        >
          Confirmar compra
        </button>
      )}
    </div>
  );
};

export default ConfirmarPedido;
