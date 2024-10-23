import buildifyLogo from "../assets/Buildify.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import Mapa from "../components/Mapa";
import { MdLocationOn } from "react-icons/md";
import SubirImagenes from "../components/subirImagenes"



const page = () => {

    interface Ubicacion {
        lat: number;
        lng: number;
    }
    const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState<Ubicacion | null>(null);
    const [openMap, setOpenMap] = useState(false);
    const [UbicacionMaterial, setUbicacionMaterial] = useState("");
    const [titulo, setTitulo] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [condicion, setCondicion] = useState("");
    const [descripcion, setDescripcion] = useState("");



    return (
        <div>
            <div className="bg-white border-gray-200 font-nunito flex justify-between w-full sm:px-4 py-4">
                <div className="flex items-center gap-2 px-2">
                    <Link to="./">
                        <img src={buildifyLogo}
                            alt="Logo de buildifyF"
                            className={`h-14 w-14 mr-2 hidden sm:block`} />
                    </Link>
                    <h1 className="self-center text-2xl font-black  whitespace-nowrap hidden sm:block">
                        Buildify
                    </h1>
                </div>
            </div>
            <div className="lg:grid lg:grid-cols-2 gap-4">
                <div className="lg:ml-20 ml-5">
                    <h1 className="font-bold lg:text-2xl text-lg">Publicar un material</h1>
                    <form action="#" method="POST" className="space-y-4 lg:mt-10 mt-5">
                        <div className="space-y-4" >
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-500 ml-2">Título</label>
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
                                <label htmlFor="price" className="block text-sm font-medium text-gray-500 ml-2">Precio</label>
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
                                <label htmlFor="category" className="block text-sm font-medium text-gray-500 ml-2">Categoría</label>
                                <select
                                    id="category"
                                    name="category"
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    <option value="obra-fina">Obra Fina</option>
                                    <option value="plomeria">Plomería</option>
                                    <option value="electricidad">Instalaciones Eléctricas</option>
                                    <option value="herramientas">Herramientas Manuales</option>
                                    <option value="obra-gruesa">Obra Gruesa</option>
                                    <option value="cemento">Cemento</option>
                                    <option value="iluminacion">Iluminacion</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="condition" className="block text-sm font-medium text-gray-500 ml-2">Condición del Material</label>
                                <select
                                    id="condition"
                                    name="condition"
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={condicion}
                                    onChange={(e) => setCondicion(e.target.value)}
                                >
                                    <option value="">Selecciona la condición</option>
                                    <option value="nuevo">Nuevo</option>
                                    <option value="usado">Usado</option>
                                    <option value="remanufacturado">Remanufacturado</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-500 ml-2">Descripción</label>
                                <textarea
                                    required
                                    placeholder="Descripción del material"
                                    id="description"
                                    name="description"
                                    rows={4}
                                    className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-4 w-3/5">
                            <label className="block text-sm font-medium text-gray-500 ml-2">Ubicación</label>
                            <div className="flex mt-1">
                                <input
                                    type="text"
                                    className="bg-gray-100 border border-gray-300 text-black text-sm rounded-md w-full p-2 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    placeholder="Tu ubicación"
                                    required
                                    value={UbicacionMaterial}
                                    onChange={(e) => setUbicacionMaterial(e.target.value)}
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
                                            onUbicacionSeleccionada={(lat: number, lng: number) => {
                                                setCoordenadasSeleccionadas({ lat, lng });
                                                setOpenMap(false);
                                            }}
                                            onDireccionObtenida={setUbicacionMaterial}
                                            className="w-full h-full"
                                        />
                                        {/* Botón para cerrar el modal */}
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-red-700 transition-colors duration-300"
                                                onClick={() => setOpenMap(false)} // Cerrar el modal
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex mt-3">
                            <button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            >
                                Publicar
                            </button>
                            <Link to="/">
                                <button
                                    type="button"
                                    className="ml-4 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors duration-300"
                                >
                                    Cancelar
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
                <div>
                </div>
            </div>
        </div>

    );
}


export default page;