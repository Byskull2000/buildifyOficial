import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faCreditCard,
  faCalendar,
  faKey,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const PagoConTarjeta: React.FC = () => {
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [mostrarConfirmacionCancelar, setMostrarConfirmacionCancelar] =
    useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error" | "">("");
  const [cargando, setCargando] = useState(false); // Estado para el spinner
  const navigate = useNavigate();

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 4);
    if (cleanValue.length > 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
    }
    return cleanValue;
  };

  const validateExpiryDate = (value: string) => {
    const [month, year] = value.split("/").map(Number);
    return month >= 1 && month <= 12 && year >= 24;
  };

  const handleConfirmarPago = () => {
    if (
      numeroTarjeta.length === 19 &&
      validateExpiryDate(fechaVencimiento) &&
      cvv.length === 3
    ) {
      setCargando(true);
      setTimeout(() => {
        setCargando(false);
        setMensaje("Pago realizado con éxito.");
        setTipoMensaje("exito");
      }, 3000); // Simula un tiempo de procesamiento de 3 segundos
    } else {
      setMensaje("Por favor, completa correctamente todos los campos.");
      setTipoMensaje("error");
    }
  };

  const handleCancelar = () => {
    setMostrarConfirmacionCancelar(true);
  };

  const confirmarCancelar = () => {
    setCargando(false); // Asegurarse de desactivar cualquier carga activa
    setMensaje("");
    setTipoMensaje("");
    setMostrarConfirmacionCancelar(false);
    navigate("/confirmar-pedido");
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Tarjeta de Débito/Crédito
      </h2>

      {/* Spinner de carga */}
      {cargando && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-[#FCA61E] text-6xl animate-spin"
            />
            <p className="text-lg font-semibold text-white mt-4">
              Procesando pago...
            </p>
          </div>
        </div>
      )}

      {/* Popup dinámico de confirmación o error */}
      {mensaje && !cargando && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FontAwesomeIcon
              icon={tipoMensaje === "exito" ? faCheckCircle : faTimesCircle}
              className={`text-4xl mb-4 ${
                tipoMensaje === "exito" ? "text-green-500" : "text-red-500"
              }`}
            />
            <p className="text-lg font-semibold text-gray-800">{mensaje}</p>
            {tipoMensaje === "exito" ? (
              <button
                onClick={() => navigate("/historialcompras")}
                className="mt-4 bg-[#FCA61E] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#e58d1a]"
              >
                Ir al Historial
              </button>
            ) : (
              <button
                onClick={() => {
                  setMensaje("");
                  setTipoMensaje("");
                }}
                className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Popup de confirmación al cancelar */}
      {mostrarConfirmacionCancelar && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              ¿Está seguro de cancelar el proceso?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmarCancelar}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700"
              >
                Sí
              </button>
              <button
                onClick={() => setMostrarConfirmacionCancelar(false)}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <FontAwesomeIcon icon={faCreditCard} />
            Número de Tarjeta
          </label>
          <input
            type="text"
            value={numeroTarjeta}
            onChange={(e) => setNumeroTarjeta(formatCardNumber(e.target.value))}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="w-full p-3 border rounded-lg shadow-md"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <FontAwesomeIcon icon={faCalendar} />
            Fecha de Vencimiento
          </label>
          <input
            type="text"
            value={fechaVencimiento}
            onChange={(e) =>
              setFechaVencimiento(formatExpiryDate(e.target.value))
            }
            placeholder="MM/AA"
            maxLength={5}
            className="w-full p-3 border rounded-lg shadow-md"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <FontAwesomeIcon icon={faKey} />
            CVV
          </label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            placeholder="123"
            maxLength={3}
            className="w-full p-3 border rounded-lg shadow-md"
          />
        </div>
      </form>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleCancelar}
          className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmarPago}
          className="bg-[#FCA61E] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#e58d1a]"
        >
          Confirmar Pago
        </button>
      </div>
    </div>
  );
};

export default PagoConTarjeta;
