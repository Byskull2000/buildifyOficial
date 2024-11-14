import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialProp } from "./CarritoCompras";

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
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-orange-100 shadow-2xl rounded-lg">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        🛒 Confirmar Pedido
      </h2>

      {/* Resumen de la compra */}
      <div className="bg-orange-50 p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Resumen de Compra
        </h3>
        {materiales.map((material) => (
          <div
            key={material.id_material}
            className="flex items-center justify-between border-b pb-4 mb-4"
          >
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800">
                {material.nombre_material}
              </h4>
              <p className="text-gray-600">
                Estado: {material.estado_material}
              </p>
              <p className="text-gray-600">
                Medida: {material.tipo_unidad_material}
              </p>
              <p className="text-gray-800 font-bold">
                Precio: Bs. {material.precio_material}
              </p>
            </div>
            <img
              src={material.imagenUrl}
              alt={material.nombre_material}
              className="w-24 h-24 rounded-lg object-cover"
            />
          </div>
        ))}
        <p className="text-lg font-bold text-gray-800">
          Total a pagar: Bs. {totalPrecio.toFixed(2)}
        </p>
      </div>

      {/* Métodos de pago */}
      <div className="bg-orange-100 p-6 rounded-lg shadow-lg text-center mb-6">
        <label
          htmlFor="metodoPago"
          className="block text-lg font-semibold mb-2 text-gray-700"
        >
          Selecciona un método de pago:
        </label>
        <select
          id="metodoPago"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="w-2/3 p-3 border rounded-lg shadow-md text-gray-700"
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
          className="bg-[#FCA61E] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#e58d1a] transition-colors"
          style={{ margin: "0 auto", display: "block" }}
        >
          Confirmar compra
        </button>
      )}
    </div>
  );
};

export default ConfirmarPedido;
