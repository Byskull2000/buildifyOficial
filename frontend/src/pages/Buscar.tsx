import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import type { MaterialProp } from "../components/Material";
import Material from "../components/Material";
import { URL_BACKEND } from "../constant/url";
import Loading from "../components/Loading";
import { useLocation } from "react-router-dom";
const Buscar = () => {
    const [resultados, setResultados] = useState<MaterialProp[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const location = useLocation();
    const searchQuery = new URLSearchParams(window.location.search).get(
        "query"
    );
    const aplicarFiltros = async (filtros: {
        nombre_material?: string | null;
        min_precio: string | null;
        max_precio: string | null;
        estado_material: string | null;
        orden_precio: string | null;
    }) => {
        filtros.estado_material = filtros.estado_material || null;
        filtros.min_precio = filtros.min_precio || null;
        filtros.max_precio = filtros.max_precio || null;
        filtros.orden_precio = filtros.orden_precio || null;

        filtros.nombre_material = searchQuery;
        try {
            setLoading(true);
            const res = await fetch(
                URL_BACKEND + "/api/materiales/buscar_avanzado",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(filtros),
                }
            );
            if (!res.ok) {
                setResultados([]);
                return;
            }
            const { data } = await res.json();
            setResultados(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    useEffect(() => {
        const obtenerMateriales = async () => {
            if (!searchQuery) {
                setResultados([]);
                return;
            }
            setLoading(true);

            try {
                const body = {
                    nombre_material: searchQuery,
                };
                const res = await fetch(
                    URL_BACKEND + "/api/materiales/buscar_avanzado",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    }
                );

                if (!res.ok) {
                    setResultados([]);
                    throw new Error("Error al obtener materiales");
                }

                const { data } = await res.json();
                setResultados(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        obtenerMateriales();
    }, [location, searchQuery]);

    return (
        <div>
            <NavBar buscar={searchQuery?.toString()} />

            <div className="md:w-[90%] mx-auto">
                <div className="flex justify-between items-center my-3">
                    <h1 className="text-xl font-semibold">
                        Resultados de la búsqueda "{searchQuery}"
                    </h1>
                    <button
                        className="flex items-center bg-yellow-400 px-4 py-2 rounded-md hover:bg-yellow-500 duration-300 transition-colors ease-in-out"
                        onClick={toggleFilter}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 4.5h18M6.75 9.75h10.5M10.5 15h3"
                            />
                        </svg>
                        <span>Filtros</span>
                    </button>
                </div>
                {/*ACA LOS FILTROS */}
                {isFilterOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
                        <div className="bg-white p-6 rounded-md shadow-lg w-[90%] md:w-[40%] xl:w-[30%]">
                            <h2 className="text-lg font-bold mb-4">
                                Opciones de Filtros
                            </h2>

                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="min_precio"
                                        className="text-sm font-semibold mb-1"
                                    >
                                        Precio Mínimo
                                    </label>
                                    <input
                                        type="number"
                                        id="min_precio"
                                        name="min_precio"
                                        className="border rounded-md px-3 py-2"
                                        placeholder="MIN"
                                        min="0"
                                        onChange={(e) => {
                                            const value = Math.max(
                                                0,
                                                Number(e.target.value)
                                            );
                                            e.target.value = value.toString();
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="max_precio"
                                        className="text-sm font-semibold mb-1"
                                    >
                                        Precio Máximo
                                    </label>
                                    <input
                                        type="number"
                                        id="max_precio"
                                        name="max_precio"
                                        className="border rounded-md px-3 py-2"
                                        placeholder="MAX"
                                        min="0"
                                        onChange={(e) => {
                                            const minInput =
                                                document.getElementById(
                                                    "min_precio"
                                                ) as HTMLInputElement | null;
                                            const minValue = minInput
                                                ? Number(minInput.value)
                                                : 0;
                                            const value = Math.max(
                                                minValue,
                                                Number(e.target.value)
                                            );
                                            e.target.value = value.toString();
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mb-4">
                                <label
                                    htmlFor="estado_material"
                                    className="text-sm font-semibold mb-1"
                                >
                                    Estado del Material
                                </label>
                                <select
                                    id="estado_material"
                                    name="estado_material"
                                    className="border rounded-md px-3 py-2"
                                >
                                    <option value="">Ninguno</option>
                                    <option value="nuevo">Nuevo</option>
                                    <option value="usado">Usado</option>
                                    <option value="remanufacturado">
                                        Remanufacturado
                                    </option>
                                </select>
                            </div>

                            {/* Filtro de Ordenar por */}
                            <div className="flex flex-col mb-4">
                                <label
                                    htmlFor="orden_precio"
                                    className="text-sm font-semibold mb-1"
                                >
                                    Ordenar por
                                </label>
                                <select
                                    id="orden_precio"
                                    name="orden_precio"
                                    className="border rounded-md px-3 py-2"
                                >
                                    <option value="">Ninguno</option>
                                    <option value="asc">
                                        Más barato primero
                                    </option>
                                    <option value="desc">
                                        Más caro primero
                                    </option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 ease-in-out "
                                    onClick={() => {
                                        const minPriceElement =
                                            document.getElementById(
                                                "min_precio"
                                            ) as HTMLInputElement | null;
                                        const maxPriceElement =
                                            document.getElementById(
                                                "max_precio"
                                            ) as HTMLInputElement | null;
                                        const estadoElement =
                                            document.getElementById(
                                                "estado_material"
                                            ) as HTMLSelectElement | null;
                                        const ordenarElement =
                                            document.getElementById(
                                                "orden_precio"
                                            ) as HTMLSelectElement | null;
                                        if (
                                            minPriceElement &&
                                            maxPriceElement &&
                                            estadoElement &&
                                            ordenarElement
                                        ) {
                                            const min_precio =
                                                minPriceElement.value;
                                            const max_precio =
                                                maxPriceElement.value;
                                            const estado_material =
                                                estadoElement.value;
                                            const orden_precio =
                                                ordenarElement.value;
                                            aplicarFiltros({
                                                min_precio,
                                                max_precio,
                                                estado_material,
                                                orden_precio,
                                            });
                                            toggleFilter();
                                        } else {
                                            console.error(
                                                "Uno o más elementos no se encontraron."
                                            );
                                        }
                                    }}
                                >
                                    Aplicar
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 ease-in-out "
                                    onClick={toggleFilter}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <Loading />
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 place-items-center">
                        {resultados.length > 0 ? (
                            resultados.map((material) => (
                                <Material
                                    key={material.id_material}
                                    material={material}
                                />
                            ))
                        ) : (
                            <h2 className="text-xl">
                                No se encontraron resultados
                            </h2>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Buscar;
