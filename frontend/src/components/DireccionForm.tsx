// src/components/DireccionForm.tsx

import React, { useState, useEffect } from "react";

interface DireccionFormProps {
  onGuardar: (
    nombre: string,
    direccion: string,
    telefono: string
  ) => Promise<void>;
  coordenadasSeleccionadas: { lat: number; lng: number } | null;
  direccion: string;
}

const DireccionForm: React.FC<DireccionFormProps> = ({
  onGuardar,
  coordenadasSeleccionadas,
  direccion,
}) => {
  const [nombre, setNombre] = useState("");
  const [direccionEditable, setDireccionEditable] = useState(direccion);
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [formValido, setFormValido] = useState(false);

  useEffect(() => {
    setDireccionEditable(direccion);
  }, [direccion]);

  useEffect(() => {
    const todosCamposLlenos =
      nombre.trim() !== "" &&
      direccionEditable.trim() !== "" &&
      telefono.trim() !== "" &&
      coordenadasSeleccionadas !== null;
    setFormValido(todosCamposLlenos);
  }, [nombre, direccionEditable, telefono, coordenadasSeleccionadas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!formValido) {
      setMensaje(
        "Por favor, completa todos los campos y selecciona una ubicación en el mapa."
      );
      return;
    }

    try {
      await onGuardar(nombre, direccionEditable, telefono);
      setMensaje("¡Dirección guardada con éxito!");
      setNombre("");
      setDireccionEditable("");
      setTelefono("");
    } catch (error) {
      setMensaje("Error al guardar la dirección. Inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-white mb-4">Agregar Nueva Dirección de Entrega</h2>

      <input
        className="block w-full p-2 mb-2 rounded"
        placeholder="Nombre de Destinatario"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        className="block w-full p-2 mb-2 rounded"
        placeholder="Dirección"
        value={direccionEditable}
        onChange={(e) => setDireccionEditable(e.target.value)}
      />

      <input
        className="block w-full p-2 mb-2 rounded"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      {coordenadasSeleccionadas && (
        <>
          <label className="block text-white mt-2">Latitud</label>
          <input
            className="block w-full p-2 mb-2 rounded bg-gray-700 text-white"
            placeholder="Latitud"
            value={coordenadasSeleccionadas.lat.toString()}
            readOnly
          />
          <label className="block text-white mt-2">Longitud</label>
          <input
            className="block w-full p-2 mb-2 rounded bg-gray-700 text-white"
            placeholder="Longitud"
            value={coordenadasSeleccionadas.lng.toString()}
            readOnly
          />
        </>
      )}

      <button
        type="submit"
        disabled={!formValido}
        className={`px-4 py-2 rounded text-white transition ${
          formValido
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
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
