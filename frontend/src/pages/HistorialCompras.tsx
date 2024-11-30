import imgMaterial1 from "../assets/material1.png";
import imgMaterial5 from "../assets/material5.png";
import imgMaterial2 from "../assets/material2.png";
import imgMaterial3 from "../assets/material3.png";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SimpleNavBar from "../components/simpleNavBar";

const nombres = [
  "Pablo",
  "Mario",
  "Lionel",
  "Andrea",
  "Sofia",
  "Carlos",
  "Miguel",
  "Ana",
  "Laura",
  "Diego",
];
const apellidos = [
  "Gomez",
  "Fernandez",
  "Martinez",
  "Perez",
  "Rodriguez",
  "Lopez",
  "Garcia",
  "Hernandez",
  "Ruiz",
  "Castro",
];

const generarNombreAleatorio = () => {
  const tipo = Math.floor(Math.random() * 3);

  switch (tipo) {
    case 0: // Solo nombre
      return nombres[Math.floor(Math.random() * nombres.length)];
    case 1: // Nombre + Apellido
      return (
        nombres[Math.floor(Math.random() * nombres.length)] +
        " " +
        apellidos[Math.floor(Math.random() * apellidos.length)]
      );
    case 2: // Nombre + Número
      return (
        nombres[Math.floor(Math.random() * nombres.length)] +
        Math.floor(Math.random() * 1000)
      );
    default:
      return "UsuarioDesconocido";
  }
};

const HistorialCompras = () => {
  const [compras, setCompras] = useState<any[]>([]);
  const [materialFilter, setMaterialFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [vendedorFilter, setVendedorFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const navigate = useNavigate();

  const formatDateForDisplay = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "Fecha inválida";
    }
    return parsedDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const comprasEjemplo = [
    {
      nombre_material: "Ladrillo",
      fecha_compra: "2024-11-01",
      vendedor: "Proveedor A",
      estado_entrega: "",
      imagenUrl: imgMaterial1,
    },
    {
      nombre_material: "Arena",
      fecha_compra: "2024-11-01",
      vendedor: "Proveedor A",
      estado_entrega: "Entregado",
      imagenUrl: imgMaterial5,
    },
    {
      nombre_material: "Ladrillo 6 huecos",
      fecha_compra: "2024-10-15",
      vendedor: "Proveedor B",
      estado_entrega: "En progreso",
      imagenUrl: imgMaterial2,
    },
    {
      nombre_material: "Ladrillo por mayor",
      fecha_compra: "2024-09-20",
      vendedor: "Proveedor A",
      estado_entrega: "Pendiente",
      imagenUrl: imgMaterial3,
    },
  ];

  interface Compra {
    nombre_material: string;
    fecha_compra: string;
    vendedor?: string;
    estado_entrega?: string;
    imagen?: string;
  }

  const loadHistorialCompras = () => {
    const historial = JSON.parse(
      localStorage.getItem("historialCompras") || "[]"
    ) as Compra[]; // Aseguramos que sea un array de `Compra`

    const historialConVendedor = historial.map((compra: Compra) => ({
      ...compra,
      vendedor: compra.vendedor || generarNombreAleatorio(),
    }));

    setCompras([...comprasEjemplo, ...historialConVendedor]); // Combinar ejemplos con datos reales
  };

  const filteredCompras = compras.filter((compra) => {
    // Asegurar valores predeterminados para evitar errores
    const vendedor =
      compra.vendedor?.toLowerCase() || generarNombreAleatorio().toLowerCase();
    const estado = compra.estado_entrega?.toLowerCase() || "sin estado";

    // Comparar material
    const materialMatch =
      !materialFilter ||
      compra.nombre_material
        .toLowerCase()
        .includes(materialFilter.toLowerCase());

    // Comparar fecha (formatear ambas para asegurarnos de que coincidan)
    const fechaMatch =
      !fechaFilter ||
      new Date(compra.fecha_compra).toLocaleDateString("en-CA") === fechaFilter;

    // Comparar vendedor
    const vendedorMatch =
      !vendedorFilter || vendedor.includes(vendedorFilter.toLowerCase());

    // Comparar estado
    const estadoMatch =
      !estadoFilter || estado.includes(estadoFilter.toLowerCase());

    return materialMatch && fechaMatch && vendedorMatch && estadoMatch;
  });

  const clearFilters = () => {
    setMaterialFilter("");
    setFechaFilter("");
    setVendedorFilter("");
    setEstadoFilter("");
  };

  const getEstadoEntregaColor = (estado: string) => {
    if (estado === "Entregado") return "text-green-500";
    if (estado === "Pendiente") return "text-yellow-500";
    if (estado === "En progreso") return "text-blue-500";
    return "text-gray-500";
  };

  useEffect(() => {
    loadHistorialCompras();
  }, []);

  return (
    <>
      <SimpleNavBar />
      <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 text-[#161931] font-poppins pt-8">
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Ajustes de usuario */}
          <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
            <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
              <h2 className="pl-3 mb-4 text-2xl font-semibold">
                Ajustes de usuario
              </h2>
              <Link
                to="/profile"
                className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
              >
                Mi cuenta
              </Link>
              <Link
                to="/historialcompras"
                className="flex items-center px-3 py-2.5 font-bold text-yellow-500 border rounded-full"
              >
                Historial de compras
              </Link>
              <Link
                to="/publicProfile"
                className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
              >
                Perfil Comercial
              </Link>
              <Link
                to="/editProfile"
                className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
              >
                Editar perfil
              </Link>
              <a
                href="#"
                className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
              >
                Notificaciones
              </a>

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  sessionStorage.removeItem("user");
                  navigate("/");
                }}
                className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
              >
                Cerrar Sesión
              </button>
            </div>
          </aside>
          {/* Listado de compras */}
          <div className="flex-1 space-y-4">
            {filteredCompras.length > 0 ? (
              filteredCompras.map((compra, index) => (
                <div key={index} className="flex border p-4 rounded-md shadow">
                  <div className="w-1/4 flex items-center justify-center">
                    <img
                      src={compra.imagenUrl || compra.imagen}
                      alt="Foto del material"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 w-3/4">
                    <h3 className="text-lg font-semibold">
                      {compra.nombre_material}
                    </h3>
                    <p className="font-semibold">
                      Fecha:{" "}
                      <span className="font-normal">
                        {formatDateForDisplay(compra.fecha_compra)}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Vendedor:{" "}
                      <span className="font-normal">
                        {compra.vendedor || generarNombreAleatorio()}
                      </span>
                    </p>
                    <p className="font-semibold text-black">
                      Estado:{" "}
                      <span
                        className={getEstadoEntregaColor(
                          compra.estado_entrega || "Sin estado"
                        )}
                      >
                        {compra.estado_entrega || "Sin estado"}
                      </span>
                    </p>
                    <button
                      className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      onClick={() =>
                        navigate("/solicitarTipoEntrega", {
                          state: {
                            material: compra,
                          },
                        })
                      }
                    >
                      Seleccionar tipo de entrega
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No se encontraron compras que coincidan con los filtros.
              </p>
            )}
          </div>
          {/* Panel de filtros */}
          <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
            <div className="sticky flex flex-col gap-2 p-4 text-sm border-l border-indigo-100 top-12">
              <h2 className="text-xl font-semibold mb-4">Filtrar compras</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium">Material</label>
                <input
                  type="text"
                  placeholder="Nombre del material"
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  value={fechaFilter}
                  onChange={(e) => setFechaFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Vendedor</label>
                <input
                  type="text"
                  placeholder="Nombre del vendedor"
                  value={vendedorFilter}
                  onChange={(e) => setVendedorFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Estado</label>
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Todos</option>
                  <option value="Entregado">Entregado</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
              <button
                onClick={clearFilters}
                className="w-full bg-yellow-500 text-white p-2 rounded mb-2"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default HistorialCompras;
