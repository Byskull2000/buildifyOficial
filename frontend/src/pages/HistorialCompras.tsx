import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SimpleNavBar from "../components/simpleNavBar";

const Page = () => {
    const [nombre_usuario, setNombre] = useState("Usuario Ejemplo");
    const [zona_trabajo, setZonaTrabajo] = useState("Zona de trabajo ejemplo");
    const [imagen_perfil, setImagenPerfil] = useState(imgEjemploPerfil);

    const materialesEjemplo = [
       
        {
            nombre_material: "Cemento",
            fecha_compra: "2024-11-01",
            vendedor: "Proveedor A",
            estado_entrega: "", // Estado inicial vacío
            imagen: "https://example.com/imagen_cemento.jpg", 
        },
        {
            nombre_material: "Arena",
            fecha_compra: "2024-10-15",
            vendedor: "Proveedor B",
            estado_entrega: "", // Estado inicial vacío
            imagen: "https://example.com/imagen_arenas.jpg", 
        },
        {
            nombre_material: "Grava",
            fecha_compra: "2024-09-20",
            vendedor: "Proveedor A",
            estado_entrega: "", // Estado inicial vacío
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

    const [propios, setPropios] = useState(materialesEjemplo);
    const [materialFilter, setMaterialFilter] = useState("");
    const [fechaFilter, setFechaFilter] = useState("");
    const [vendedorFilter, setVendedorFilter] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const filtered = materialesEjemplo.filter((material) =>
            (!materialFilter || material.nombre_material.toLowerCase().includes(materialFilter.toLowerCase())) &&
            (!fechaFilter || material.fecha_compra === fechaFilter) &&
            (!vendedorFilter || material.vendedor.toLowerCase().includes(vendedorFilter.toLowerCase())) &&
            (!estadoFilter || material.estado_entrega.toLowerCase().includes(estadoFilter.toLowerCase()))
        );
        setPropios(filtered);
    }, [materialFilter, fechaFilter, vendedorFilter, estadoFilter]);

    const clearFilters = () => {
        setMaterialFilter("");
        setFechaFilter("");
        setVendedorFilter("");
        setEstadoFilter("");
    };

    // Función para asignar un color al estado de entrega
    type EstadoEntrega = "Entregado" | "Pendiente" | "En tránsito";

    const getEstadoEntregaColor = (estado: EstadoEntrega) => {
        if (estado === "Entregado") return "text-green-500";
        if (estado === "Pendiente") return "text-yellow-500";
        if (estado === "En tránsito") return "text-red-500";
        return "text-gray-500";
    };

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
                            <Link to="/profile">
                                <a
                                    href="#"
                                    className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                                >
                                    Mi cuenta
                                </a>
                            </Link>
                            <Link to="/historialcompras">
                                <a
                                    href="#"
                                    className="flex items-center px-3 py-2.5 font-bold text-yellow-500 border rounded-full"
                                >
                                    Historial de compras
                                </a>
                            </Link>
                            <Link to="/publicProfile">
                                <a
                                    href="#"
                                    className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                                >
                                    Perfil Comercial
                                </a>
                            </Link>
                            <Link to="/editProfile">
                                <a
                                    href="#"
                                    className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                                >
                                    Editar perfil
                                </a>
                            </Link>
                            <a
                                href="#"
                                className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                            >
                                Notificaciones
                            </a>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('user')
                                    sessionStorage.removeItem('user')
                                    navigate('/')
                                }}
                                className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                            >
                                Cerrar Sesion
                            </button>
                        </div>
                    </aside>

                    {/* Listado de materiales (centro) */}
                    <div className="flex-1 space-y-4">
                        {propios.map((material, index) => (
                            <div key={index} className="flex border p-4 rounded-md shadow">
                                <div className="w-1/4 flex items-center justify-center">
                                    <img
                                        src={material.imagen} // Aquí se carga la imagen dinámica
                                        alt="Foto"
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                </div>
                                <div className="ml-4 w-3/4">
    <h3 className="text-lg font-semibold">
        {material.nombre_material}
    </h3>
    <p className="font-semibold">Fecha de compra: <span className="font-normal">{material.fecha_compra}</span></p>
    <p className="font-semibold">Vendedor: <span className="font-normal">{material.vendedor}</span></p>
    <div className="flex items-center justify-between">
        <p className="font-semibold text-black">Estado de entrega: 
            <span className={getEstadoEntregaColor(material.estado_entrega as EstadoEntrega)}>
                {material.estado_entrega || "Sin asignar"}
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

                            </div>
                        ))}
                    </div>

                    {/* Panel de filtros (derecha) */}
                    <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                        <div className="sticky flex flex-col gap-2 p-4 text-sm border-l border-indigo-100 top-12">
                            <h2 className="text-xl font-semibold mb-4">Filtrar compras</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Material</label>
                                <input
                                    type="text"
                                    placeholder="Nombre de material"
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
                                <label className="block text-sm font-medium">Nombre de vendedor</label>
                                <input
                                    type="text"
                                    placeholder="Escribir Nombre"
                                    value={vendedorFilter}
                                    onChange={(e) => setVendedorFilter(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Estado de entrega</label>
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

export default Page;
