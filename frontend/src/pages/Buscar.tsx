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

    const [min_precio, setMinPrecio] = useState<number | null>(null);
    const [max_precio, setMaxPrecio] = useState<number | null>(null);
    const [estado_material, setEstadoMaterial] = useState<string | null>(null);
    //const [id_tipo_material, setIdTipoMaterial] = useState<number | null>(null);
    const [orden_precio, setOrdenPrecio] = useState<string | null>(null);

    useEffect(() => {
        const obtenerMateriales = async () => {
            setLoading(true);
            try {
                const body = {
                    nombre_material: searchQuery,
                    min_precio,
                    max_precio,
                    estado_material,
                    orden_precio,
                };
                console.log(body);

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

        // Fetch materials whenever searchQuery or filters change
        if (searchQuery) {
            obtenerMateriales();
        } else {
            setResultados([]);
        }
    }, [
        searchQuery,
        min_precio,
        max_precio,
        estado_material,
        orden_precio,
        location,
    ]);

    return (
        <div>
            <NavBar buscar={searchQuery?.toString()} />

            <div className="md:w-[90%] mx-auto flex">
                <aside className="hidden py-4 md:w-1/5 lg:w-1/5 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">
                            Filtros
                        </h2>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex flex-col w-full">
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
                                    className="border rounded-md px-3 py-2 w-full max-w-full"
                                    placeholder="MIN"
                                    min="0"
                                    onChange={(e) => {
                                        const value =
                                            e.target.value === ""
                                                ? null
                                                : Math.max(
                                                    0,
                                                    Number(e.target.value)
                                                );
                                        setMinPrecio(value);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col w-full">
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
                                    className="border rounded-md px-3 py-2 w-full max-w-full"
                                    placeholder="MAX"
                                    min="0"
                                    max="20000"
                                    onChange={(e) => {
                                        let value = Number(e.target.value);

                                        if (value > 20000) {
                                            value = 20000;
                                        }

                                        value = Math.max(min_precio || 0, value);
                                        setMaxPrecio(value);
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
                                onChange={(e) =>
                                    setEstadoMaterial(e.target.value)
                                }
                            >
                                <option value="">Ninguno</option>
                                <option value="nuevo">Nuevo</option>
                                <option value="usado">Usado</option>

                            </select>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label
                                htmlFor="orden_precio"
                                className="text-base font-bold mb-2 text-gray-700"
                            >
                                Ordenar por
                            </label>
                            <hr className="border-t border-gray-300 mb-4" />
                            <label
                                htmlFor="orden_precio"
                                className="text-sm font-medium mb-3 text-gray-600"
                            >
                                Precio
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        id="ninguno-radio"
                                        type="radio"
                                        value="null"
                                        name="orden_precio"
                                        checked={orden_precio === null}
                                        onChange={() => setOrdenPrecio(null)}
                                        className={`w-5 h-5 ${!orden_precio
                                            ? "text-blue-600"
                                            : "text-gray-300"
                                            } border-gray-300 focus:ring-blue-500`}
                                    />
                                    <label
                                        htmlFor="ninguno-radio"
                                        className="ml-3 text-sm font-medium text-gray-700"
                                    >
                                        Ninguno
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="barato-radio"
                                        type="radio"
                                        value="asc"
                                        name="orden_precio"
                                        checked={orden_precio === "asc"}
                                        onChange={() => setOrdenPrecio("asc")}
                                        className={`w-5 h-5 ${orden_precio === "asc"
                                            ? "text-blue-600"
                                            : "text-gray-300"
                                            } border-gray-300 focus:ring-blue-500`}
                                    />
                                    <label
                                        htmlFor="barato-radio"
                                        className="ml-3 text-sm font-medium text-gray-700"
                                    >
                                        Más barato primero
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="caro-radio"
                                        type="radio"
                                        value="desc"
                                        name="orden_precio"
                                        checked={orden_precio === "desc"}
                                        onChange={() => setOrdenPrecio("desc")}
                                        className={`w-5 h-5 ${orden_precio === "desc"
                                            ? "text-blue-600"
                                            : "text-gray-300"
                                            } border-gray-300 focus:ring-blue-500`}
                                    />
                                    <label
                                        htmlFor="caro-radio"
                                        className="ml-3 text-sm font-medium text-gray-700"
                                    >
                                        Más caro primero
                                    </label>
                                </div>
                            </div>
                            <hr className="border-t border-gray-300 mb-4 mt-4" />
                            <label
                                htmlFor="orden_precio"
                                className="text-sm font-medium mb-3 text-gray-600"
                            >
                                Cercanía
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        id="ninguno-radio"
                                        type="radio"
                                        value="null"
                                        name="orden_precio"
                                        checked={orden_precio === null}
                                        onChange={() => setOrdenPrecio(null)}
                                        className={`w-5 h-5 ${!orden_precio
                                            ? "text-blue-600"
                                            : "text-gray-300"
                                            } border-gray-300 focus:ring-blue-500`}
                                    />
                                    <label
                                        htmlFor="ninguno-radio"
                                        className="ml-3 text-sm font-medium text-gray-700"
                                    >
                                        Ninguno
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="barato-radio"
                                        type="radio"
                                        value="asc"
                                        name="orden_precio"
                                        checked={orden_precio === "asc"}
                                        onChange={() => setOrdenPrecio("asc")}
                                        className={`w-5 h-5 ${orden_precio === "asc"
                                            ? "text-blue-600"
                                            : "text-gray-300"
                                            } border-gray-300 focus:ring-blue-500`}
                                    />
                                    <label
                                        htmlFor="barato-radio"
                                        className="ml-3 text-sm font-medium text-gray-700"
                                    >
                                        Más cercano primero
                                    </label>
                                </div>
                            </div>
                            <hr className="border-t border-gray-300 mb-4 mt-4" />
                            <label
                                htmlFor="orden_precio"
                                className="text-sm font-medium mb-3 text-gray-600"
                            >
                                Zona
                            </label>
                            <select
                                id="estado_material"
                                name="estado_material"
                                className="border rounded-md px-3 py-2"
                                onChange={(e) =>
                                    setEstadoMaterial(e.target.value)
                                }
                            >
                                <option value="">Ninguno</option>
                                <option value="cercado">Cercado</option>
                                <option value="tiquipaya">Tiquipaya</option>
                                <option value="sacaba">Sacaba</option>
                            </select>
                            <button className="py-2 bg-blue-600 text-white p-2 mt-10 font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">
                                Guardar filtros
                            </button>
                        </div>
                    </div>
                </aside>
                <div className="ml-3 w-full">
                    <div className="flex justify-between items-center my-3">
                        <h1 className="text-xl font-semibold">
                            Resultados de la búsqueda "{searchQuery}"
                        </h1>
                    </div>
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 place-items-center">
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
        </div>
    );
};

export default Buscar;
