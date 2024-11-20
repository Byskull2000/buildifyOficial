//import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SimpleNavBar from "../components/simpleNavBar";

const HistorialCompras = () => {
  const [compras, setCompras] = useState<any[]>([]);
  const [materialFilter, setMaterialFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [vendedorFilter, setVendedorFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const navigate = useNavigate();

  const comprasEjemplo = [
    {
      nombre_material: "Cemento",
      fecha_compra: "2024-11-01",
      vendedor: "Proveedor A",
      estado_entrega: "",
      imagen: "https://example.com/imagen_cemento.jpg",
    },
    {
      nombre_material: "Arena",
      fecha_compra: "2024-10-15",
      vendedor: "Proveedor B",
      estado_entrega: "",
      imagen: "https://example.com/imagen_arenas.jpg",
    },
    {
      nombre_material: "Grava",
      fecha_compra: "2024-09-20",
      vendedor: "Proveedor A",
      estado_entrega: "",
      imagen: "https://example.com/imagen_grava.jpg",
    },
    {
      nombre_material: "Cemento",
      fecha_compra: "2024-11-01",
      vendedor: "Proveedor A",
      estado_entrega: "Entregado",
      imagen: "https://example.com/imagen_cemento.jpg",
    },
    {
      nombre_material: "Arena",
      fecha_compra: "2024-10-15",
      vendedor: "Proveedor B",
      estado_entrega: "En tránsito",
      imagen: "https://example.com/imagen_arenas.jpg",
    },
    {
      nombre_material: "Grava",
      fecha_compra: "2024-09-20",
      vendedor: "Proveedor A",
      estado_entrega: "Pendiente",
      imagen: "https://example.com/imagen_grava.jpg",
    },
  ];

  const fetchHistorialCompras = async () => {
    const userStorage =
      sessionStorage.getItem("user") || localStorage.getItem("user") || null;
    const user = userStorage ? JSON.parse(userStorage) : null;
    const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

    if (!user) {
      console.error("Usuario no autenticado");
      setCompras(comprasEjemplo);
      return;
    }

    try {
      const response = await fetch(
        `${URL_BACKEND}/api/pedidos/${user.id_usuario}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al obtener el historial: ${await response.text()}`
        );
      }

      const result = await response.json();
      if (result.data) {
        const datosReales = result.data.map((pedido: any) => ({
          nombre_material: pedido.material.nombre_material,
          fecha_compra: pedido.fecha_pedido,
          vendedor:
            pedido.material.descripcion_material || "Vendedor desconocido",
          estado_entrega: pedido.estado_pedido || "Pendiente",
          imagen: pedido.material.imagen || "https://example.com/default.jpg",
        }));
        setCompras([...comprasEjemplo, ...datosReales]);
      }
    } catch (error) {
      console.error("Error al obtener el historial de compras:", error);
      setCompras(comprasEjemplo);
    }
  };

  const filteredCompras = compras.filter(
    (compra) =>
      (!materialFilter ||
        compra.nombre_material
          .toLowerCase()
          .includes(materialFilter.toLowerCase())) &&
      (!fechaFilter || compra.fecha_compra === fechaFilter) &&
      (!vendedorFilter ||
        compra.vendedor.toLowerCase().includes(vendedorFilter.toLowerCase())) &&
      (!estadoFilter ||
        compra.estado_entrega
          .toLowerCase()
          .includes(estadoFilter.toLowerCase()))
  );

  const clearFilters = () => {
    setMaterialFilter("");
    setFechaFilter("");
    setVendedorFilter("");
    setEstadoFilter("");
  };

  const getEstadoEntregaColor = (estado: string) => {
    if (estado === "Entregado") return "text-green-500";
    if (estado === "Pendiente") return "text-yellow-500";
    if (estado === "En tránsito") return "text-red-500";
    return "text-gray-500";
  };

  useEffect(() => {
    fetchHistorialCompras();
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
                      src={compra.imagen}
                      alt="Foto del material"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 w-3/4">
                    <h3 className="text-lg font-semibold">
                      {compra.nombre_material}
                    </h3>
                    <p className="font-semibold">
                      Fecha:{" "}
                      <span className="font-normal">{compra.fecha_compra}</span>
                    </p>
                    <p className="font-semibold">
                      Vendedor:{" "}
                      <span className="font-normal">{compra.vendedor}</span>
                    </p>
                    <p className="font-semibold text-black">
                      Estado:{" "}
                      <span
                        className={getEstadoEntregaColor(compra.estado_entrega)}
                      >
                        {compra.estado_entrega || "Sin asignar"}
                      </span>
                    </p>
                    <button
                      className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      onClick={() => navigate("/solicitarTipoEntrega")}
                    >
                      Seleccionar tipo de entrega
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron compras.</p>
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
                  <option value="En tránsito">En tránsito</option>
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
