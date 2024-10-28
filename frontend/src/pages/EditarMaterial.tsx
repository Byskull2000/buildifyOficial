import { useParams } from "react-router-dom";
import NavBar from "../components/simpleNavBar";
import { useState } from "react";
import { MdLocationOn } from "react-icons/md";
import Mapa from "../components/Mapa";

const Editar = () => {
    interface Ubicacion {
        lat: number;
        lng: number;
    }
    const [, setCoordenadasSeleccionadas] =  useState<Ubicacion | null>(null);
    const { id_material } = useParams<{ id_material: string }>();
    const [openMap, setOpenMap] = useState(false);
    const [UbicacionMaterial, setUbicacionMaterial] = useState("");
    const [titulo, setTitulo] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [condicion, setCondicion] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [unidad, setUnidad] = useState("");
    const [cantidad, setCantidad] = useState("");

    return (
        <div>
            <NavBar />
            
            <div className="p-4 font-nunito"> 
                <h2 className="text-2xl font-bold">Editar Material</h2>
                <p>ID del Material: {id_material}</p>
                <div className="lg:ml-20 ml-5">
                    <form
                        action="#"
                        method="POST"
                        className="space-y-4 lg:mt-10 mt-5"
                    >
                        <div className="space-y-4"> {/*CARGAR LOS DATOS DEL BACKEND A LOS INPUTS*/}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-500 ml-2"
                                >
                                    Título
                                </label>
                                <input
                                    required
                                    placeholder="Título del material"
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-500 ml-2"
                                >
                                    Precio
                                </label>
                                <input
                                    required
                                    placeholder="Precio en Bs."
                                    type="number"
                                    id="price"
                                    name="price"
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    min="0"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-500 ml-2"
                                >
                                    Categoría
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={categoria}
                                    onChange={(e) =>
                                        setCategoria(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Selecciona una categoría
                                    </option>
                                    <option value="obra-fina">Obra Fina</option>
                                    <option value="plomeria">Plomería</option>
                                    <option value="electricidad">
                                        Instalaciones Eléctricas
                                    </option>
                                    <option value="herramientas">
                                        Herramientas Manuales
                                    </option>
                                    <option value="obra-gruesa">
                                        Obra Gruesa
                                    </option>
                                    <option value="cemento">Cemento</option>
                                    <option value="iluminacion">
                                        Iluminacion
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="condition"
                                    className="block text-sm font-medium text-gray-500 ml-2"
                                >
                                    Condición del Material
                                </label>
                                <select
                                    id="condition"
                                    name="condition"
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={condicion}
                                    onChange={(e) =>
                                        setCondicion(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Selecciona la condición
                                    </option>
                                    <option value="nuevo">Nuevo</option>
                                    <option value="usado">Usado</option>
                                    <option value="remanufacturado">
                                        Remanufacturado
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Unidad
                                </label>
                                <select
                                    value={unidad}
                                    onChange={(e) => setUnidad(e.target.value)}
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                >
                                    <option value="">
                                        Selecciona una unidad
                                    </option>
                                    <option value="metroLineal">
                                        Metro lineal
                                    </option>
                                    <option value="metroCuadrado">
                                        Metro Cuadrado
                                    </option>
                                    <option value="metroCubico">
                                        Metro Cúbico
                                    </option>
                                    <option value="unidad">Unidad</option>
                                    <option value="kilogramo">Kilogramo</option>
                                    <option value="paquete">Paquete</option>
                                    <option value="litro">Litro</option>
                                    <option value="docena">Docena</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="units"
                                    className="block text-sm font-medium text-gray-500 ml-2"
                                >
                                    Cantidad disponible
                                </label>
                                <input
                                    required
                                    placeholder="Cantidad disponible:"
                                    type="number"
                                    id="unidad"
                                    name="unidad"
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={cantidad}
                                    onChange={(e) =>
                                        setCantidad(e.target.value)
                                    }
                                    min="0"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-500 ml-2"
                                >
                                    Descripción
                                </label>
                                <textarea
                                    required
                                    placeholder="Descripción del material"
                                    id="description"
                                    name="description"
                                    rows={4}
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={descripcion}
                                    onChange={(e) =>
                                        setDescripcion(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="mb-4 w-3/5">
                            <label className="block text-sm font-medium text-gray-500 ml-2">
                                Ubicación
                            </label>
                            <div className="flex mt-1">
                                <input
                                    type="text"
                                    className="bg-gray-100 border border-gray-300 text-black text-sm rounded-md w-full p-2 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    placeholder="Tu ubicación"
                                    required
                                    value={UbicacionMaterial}
                                    onChange={(e) =>
                                        setUbicacionMaterial(e.target.value)
                                    }
                                />
                                <div
                                    onClick={() => setOpenMap(!openMap)}
                                    className="ml-2 p-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:cursor-pointer transition-colors duration-300"
                                >
                                    <MdLocationOn className="text-xl text-black" />
                                </div>
                            </div>
                            {openMap && (
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                    onClick={() => setOpenMap(false)} // Cerrar modal al hacer clic fuera
                                >
                                    <div
                                        className="bg-white p-6 rounded-lg w-full max-w-2xl h-[400px] lg:h-[600px] flex flex-col" // Asegúrate de que el contenedor sea un flex-column
                                        onClick={(e) => e.stopPropagation()} // Prevenir cierre al hacer clic dentro del modal
                                    >
                                        <Mapa
                                            onUbicacionSeleccionada={(
                                                lat: number,
                                                lng: number
                                            ) => {
                                                setCoordenadasSeleccionadas({
                                                    lat,
                                                    lng,
                                                });
                                                setOpenMap(false);
                                            }}
                                            onDireccionObtenida={
                                                setUbicacionMaterial
                                            }
                                            className="w-full h-full"
                                        />
                                        {/* Botón para cerrar el modal */}
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-red-700 transition-colors duration-300"
                                                onClick={() =>
                                                    setOpenMap(false)
                                                } // Cerrar el modal
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Editar;
