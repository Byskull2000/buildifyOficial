import React, { useState } from "react";
import { Link } from "react-router-dom";
// Define la interfaz para las props
interface FormEliminacionProps {
  onConfirm: (motivo: string) => void; // Asegúrate de que la firma sea correcta
  onCancel: () => void;
}

const FormEliminacion: React.FC<FormEliminacionProps> = ({ onConfirm, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [otroMotivo, setOtroMotivo] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setIsSubmitDisabled(false);
  };

  const handleOtroMotivoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOtroMotivo(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const motivo = selectedOption === "otro" ? otroMotivo : selectedOption;
    if (!motivo) {
      alert("Por favor, selecciona un motivo para continuar.");
      return;
    }
    setShowConfirmPopup(true); // Mostrar el popup de confirmación
  };

  const handleConfirm = () => {
    const motivo = selectedOption === "otro" ? otroMotivo : selectedOption;
    onConfirm(motivo); // Llama a onConfirm con el motivo
    setShowConfirmPopup(false); // Cerrar el popup después de confirmar
    console.log('Publicación desactivada exitosamente');
    alert('Publicación desactivada exitosamente');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">
          Motivo para eliminar la publicación
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="motivo"
                value="Material incorrecto"
                checked={selectedOption === "Material incorrecto"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              Material incorrecto
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="motivo"
                value="Publicación duplicada"
                checked={selectedOption === "Publicación duplicada"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              Publicación duplicada
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="motivo"
                value="Violación de políticas"
                checked={selectedOption === "Violación de políticas"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              Violación de políticas
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="motivo"
                value="otro"
                checked={selectedOption === "otro"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              OTRO
            </label>
            {selectedOption === "otro" && (
              <input
                type="text"
                value={otroMotivo}
                onChange={handleOtroMotivoChange}
                placeholder="Especifica el motivo"
                className="w-full p-2 border border-gray-300 rounded"
              />
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded ${isSubmitDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
                }`}
            >
              Enviar
            </button>
          </div>
        </form>

        {/* Popup de confirmación */}
        {showConfirmPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full align-middle relative">
              <h1>¿Está seguro de desactivar la publicación?</h1>
              <button
                onClick={onCancel}
                className="absolute top-0 right-0 m-4 text-black hover:bg-gray-200 rounded-full p-1"
              >
                &times;
              </button>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                >
                  Cancelar
                </button>
                <Link to="/publicProfile">
                {/*Logica de eliminacion aca*/}
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Confirmar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormEliminacion;
