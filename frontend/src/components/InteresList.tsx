import React, { useState, useEffect, useRef } from "react";

interface Material {
  id: number;
  name: string;
  icon: string;
  interested: boolean;
}

const InterestList: React.FC = () => {
  const initialMaterials = [
    { id: 1, name: "Ladrillo", icon: "🧱", interested: false },
    { id: 2, name: "Cemento", icon: "🏗️", interested: false },
    { id: 3, name: "Tablones", icon: "🪓", interested: false },
    { id: 4, name: "Vigas", icon: "🔩", interested: false },
    { id: 5, name: "Arena", icon: "🏖️", interested: false },
    { id: 6, name: "Mezclas", icon: "🛠️", interested: false },
    { id: 7, name: "Herramientas", icon: "🧰", interested: false },
    { id: 8, name: "Madera", icon: "🌲", interested: false },
    { id: 9, name: "Tejas", icon: "🏠", interested: false },
    { id: 10, name: "Yeso", icon: "🏗️", interested: false },
    { id: 11, name: "Piedras", icon: "⛰️", interested: false },
  ];

  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Verifica si el usuario está registrado
  const userStorage =
    sessionStorage.getItem("user") || localStorage.getItem("user") || null;
  const user = userStorage ? JSON.parse(userStorage) : null;

  useEffect(() => {
    if (user) {
      // Llamar a la API para obtener los intereses del usuario con fetch
      fetch(`/api/intereses/${user.id_usuario}`)
        .then((response) => response.json())
        .then((data) => {
          const intereses = data.data;

          // Marcar los materiales como seleccionados si están en la lista de intereses
          const updatedMaterials = materials.map((material) =>
            intereses.some(
              (interes: any) => interes.id_tipoMaterial === material.id
            )
              ? { ...material, interested: true }
              : material
          );

          setMaterials(updatedMaterials);
        })
        .catch((error) => {
          console.error("Error al obtener los intereses:", error);
        });
    }
  }, [user]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckboxChange = (id: number) => {
    const updatedMaterials = materials.map((material) =>
      material.id === id
        ? { ...material, interested: !material.interested }
        : material
    );
    setMaterials(updatedMaterials);
  };

  const guardarIntereses = async () => {
    const interesesSeleccionados = materials
      .filter((material) => material.interested)
      .map((material) => ({
        id_tipoMaterial: material.id,
        fecha_seleccion: new Date().toISOString(), // Agregar la fecha actual de selección
      }));

    if (!user) {
      console.error("No hay usuario registrado");
      return;
    }

    try {
      // Llamada a la API para registrar los intereses seleccionados usando fetch
      const response = await fetch("/api/registrar_interes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: user.id_usuario,
          intereses: interesesSeleccionados,
        }),
      });

      const result = await response.json();
      setMessage(result.message); // Mostrar el mensaje de éxito
      console.log(result.message);

      // Ordena los intereses seleccionados al inicio solo al guardar
      const sortedMaterials = [...materials].sort(
        (a, b) => Number(b.interested) - Number(a.interested)
      );
      setMaterials(sortedMaterials);

      setIsExpanded(false); // Cierra la lista después de guardar
    } catch (error) {
      setMessage("Error al guardar los intereses. Inténtalo de nuevo.");
      console.error("Error al guardar los intereses:", error);
    }
  };

  const interesesSeleccionados = materials.some(
    (material) => material.interested
  );

  return (
    <div style={{ padding: "20px" }}>
      {user && ( // Solo muestra el contenido si el usuario está registrado
        <>
          <div style={detailsStyle} onClick={handleToggle}>
            <summary style={summaryStyle}>LISTA DE INTERESES</summary>
          </div>
          <div
            ref={contentRef}
            style={{
              ...curtainStyle,
              height: isExpanded
                ? `${contentRef.current?.scrollHeight}px`
                : "0px",
              position: "relative",
            }}
          >
            <ul style={listStyle}>
              {materials.map((material) => (
                <li
                  key={material.id}
                  style={itemStyle(material.interested)}
                  onClick={() => handleCheckboxChange(material.id)}
                >
                  <span style={{ marginRight: "10px" }}>{material.icon}</span>
                  <span style={{ flexGrow: 1 }}>{material.name}</span>
                  <input
                    type="checkbox"
                    checked={material.interested}
                    onChange={() => handleCheckboxChange(material.id)}
                    style={{ pointerEvents: "none" }}
                  />
                </li>
              ))}

              {/* Botón siempre visible al fondo del área de lista */}
              {interesesSeleccionados && (
                <li style={stickyButtonStyle}>
                  <button onClick={guardarIntereses} style={buttonStyle}>
                    Guardar Intereses
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Mostrar el mensaje de éxito o error */}
          {message && <p>{message}</p>}
        </>
      )}
    </div>
  );
};

const detailsStyle: React.CSSProperties = {
  width: "350px",
  cursor: "pointer",
  marginLeft: "0",
};

const summaryStyle: React.CSSProperties = {
  backgroundColor: "#FFC107",
  color: "black",
  padding: "10px",
  borderRadius: "4px",
  userSelect: "none",
  listStyle: "none",
  textAlign: "center",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  width: "100%",
};

const curtainStyle: React.CSSProperties = {
  overflow: "hidden",
  transition: "height 0.5s ease",
};

const listStyle: React.CSSProperties = {
  listStyleType: "none",
  padding: 0,
  margin: "0",
  backgroundColor: "#FFF8E1",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  opacity: 0.9,
  width: "350px",
  maxHeight: "400px",
  overflowY: "auto",
};

const itemStyle = (interested: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  padding: "10px",
  borderBottom: "1px solid #ddd",
  backgroundColor: interested ? "#FFF176" : "#F0F0F0", // Color más opaco para no seleccionados
  transition: "background-color 0.3s",
  cursor: "pointer",
  opacity: interested ? 1 : 0.6, // Opacidad para los no seleccionados
});

const stickyButtonStyle: React.CSSProperties = {
  position: "sticky",
  bottom: "0",
  backgroundColor: "#FFF8E1",
  padding: "10px 0",
  display: "flex",
  justifyContent: "center",
  boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.1)",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#FFC107",
  color: "black",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

export default InterestList;

