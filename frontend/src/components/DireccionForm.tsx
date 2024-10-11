import React, { useState } from "react";

interface DireccionFormProps {
  onGuardar: (
    nombre: string,
    direccion: string,
    telefono: string
  ) => Promise<void>;
}

const DireccionForm: React.FC<DireccionFormProps> = ({ onGuardar }) => {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null); // Limpiar mensaje anterior

    try {
      await onGuardar(nombre, direccion, telefono);
      setMensaje("¡Dirección guardada con éxito!"); // Solo si la operación fue exitosa
    } catch (error) {
      setMensaje("Error al guardar la dirección. Inténtalo de nuevo."); // Si hay un error
    }

    // Limpiar formulario después de la operación
    setNombre("");
    setDireccion("");
    setTelefono("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-white mb-4">Agregar Nueva Dirección de Entrega</h2>

      <input
        className="block w-full p-2 mb-2 rounded"
        placeholder="Nombre de usuario"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        className="block w-full p-2 mb-2 rounded"
        placeholder="Direccion"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />

      <input
        className="block w-full p-2 mb-2 rounded"
        placeholder="Telefono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
      >
        Guardar Dirección
      </button>

      {mensaje && (
        <p
          className={`mt-4 ${
            mensaje.includes("éxito") ? "text-green-500" : "text-red-500"
          }`}
        >
          {mensaje}
        </p>
      )}
    </form>
  );
};

export default DireccionForm;
