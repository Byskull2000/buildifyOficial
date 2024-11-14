import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faQrcode,
  faDownload,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const PagoConQR: React.FC = () => {
  const [mensaje, setMensaje] = useState("");
  const [mostrarConfirmacionCancelar, setMostrarConfirmacionCancelar] =
    useState(false);
  const [cargando, setCargando] = useState(false); // Estado para el spinner
  const qrCodeUrl = "https://via.placeholder.com/200"; // URL temporal del QR (reemplazar con el QR real)
  const navigate = useNavigate();

  const handleDescargarQR = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "CodigoQR.png";
    link.click();
  };

  const handleConfirmarPago = () => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setMensaje("Pago realizado con éxito.");
    }, 3000); // Simula un tiempo de procesamiento de 3 segundos
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Pago con QR Simple
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

      {/* Popup de confirmación de pago */}
      {mensaje && !cargando && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 text-4xl mb-4"
            />
            <p className="text-lg font-semibold text-gray-800">{mensaje}</p>
            <button
              onClick={() => navigate("/historialcompras")}
              className="mt-4 bg-[#FCA61E] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#e58d1a]"
            >
              Ir al Historial
            </button>
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
                onClick={() => navigate("/confirmar-pedido")}
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

      {/* Contenido principal */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faQrcode} />
          Escanea el código QR para realizar el pago:
        </p>
        <img
          src={qrCodeUrl}
          alt="Código QR"
          className="mx-auto mb-4 border rounded-lg shadow-md"
        />
        <div className="flex justify-center">
          <button
            onClick={handleDescargarQR}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors mb-6 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            Descargar Código QR
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setMostrarConfirmacionCancelar(true)}
          className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmarPago}
          className="bg-[#FCA61E] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#e58d1a]"
        >
          Ya realicé el pago
        </button>
      </div>
    </div>
  );
};

export default PagoConQR;

