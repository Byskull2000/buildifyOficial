import React, { useState } from 'react';

const FormEliminacion = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [otroMotivo, setOtroMotivo] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setIsSubmitDisabled(false);
  };

  const handleOtroMotivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtroMotivo(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedOption === 'otro' && !otroMotivo) {
      alert('Por favor, especifica el motivo si seleccionaste "OTRO".');
    } else {
      alert(`Motivo seleccionado: ${selectedOption === 'otro' ? otroMotivo : selectedOption}`);
      // Aquí puedes manejar el envío, como enviar los datos al servidor.
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Motivo para eliminar la publicación</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="motivo"
                value="Material incorrecto"
                checked={selectedOption === 'Material incorrecto'}
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
                checked={selectedOption === 'Publicación duplicada'}
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
                checked={selectedOption === 'Violación de políticas'}
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
                checked={selectedOption === 'otro'}
                onChange={handleOptionChange}
                className="mr-2"
              />
              OTRO
            </label>
            {selectedOption === 'otro' && (
              <input
                type="text"
                value={otroMotivo}
                onChange={handleOtroMotivoChange}
                placeholder="Especifica el motivo"
                className="w-full p-2 border border-gray-300 rounded"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormEliminacion;
