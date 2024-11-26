import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faQrcode,
  faDownload,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import buildifyLogo from "../assets/Buildify.png"; // Logo de Buildify
import fondoQR from "../assets/FondoQR.png"; // Fondo del apartado

const PagoConQR: React.FC = () => {
  const { idUsuario } = useParams<{ idUsuario: string }>(); // Obtener el idUsuario desde los parámetros de la URL
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // URL del QR
  const [mensaje, setMensaje] = useState("");
  const [mostrarConfirmacionCancelar, setMostrarConfirmacionCancelar] =
    useState(false);
  const [cargando, setCargando] = useState(false); // Estado para el spinner
  const navigate = useNavigate();

  // Efecto para obtener el código QR del vendedor
  useEffect(() => {
    const fetchQrCode = async () => {
      if (idUsuario) {
        try {
          // Realizar la solicitud para obtener el código QR
          const response = await axios.get(`/api/usuarios/${idUsuario}/qr`);
          console.log("Respuesta del servidor:", response); // Verifica la respuesta
          
          if (response.data && response.data.imagen_qr) {
            setQrCodeUrl(response.data.imagen_qr); // Guardar la URL del QR en el estado
          } else {
            console.error("La respuesta no contiene la URL del QR.");
            setQrCodeUrl(null); // Si no se encuentra el QR, limpiamos el estado
          }
        } catch (error) {
          console.error("Error al obtener el código QR:", error);
          setQrCodeUrl(null); // Si hay un error, limpiamos el estado del QR
        }
      }
    };
    fetchQrCode(); // Llamar la función para obtener el QR
  }, [idUsuario]); // Volver a ejecutar cuando cambie el idUsuario

  // Función para descargar el código QR
  const handleDescargarQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = "CodigoQR.png";
      link.click();
    }
  };

  // Función para confirmar el pago
  const handleConfirmarPago = () => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setMensaje("Pago realizado con éxito.");

      // Limpiar el carrito
      localStorage.removeItem("carrito");
    }, 3000); // Simula un tiempo de procesamiento de 3 segundos
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center py-10 px-4 flex flex-col items-center"
      style={{ backgroundImage: `url(${fondoQR})` }} // Fondo fijo
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
        📱 Pago con QR Simple
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
        <p className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faQrcode} />
          Escanea el código QR para realizar el pago:
        </p>
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="Código QR"
            className="mx-auto mb-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          />
        ) : (
          <p className="text-gray-500">Cargando el código QR...</p>
        )}
        <div className="flex justify-center">
          <button
            onClick={handleDescargarQR}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colores mb-6 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            Descargar Código QR
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between mt-8 w-full max-w-lg">
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
