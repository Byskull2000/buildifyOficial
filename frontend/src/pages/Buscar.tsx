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
    const [selected, setSelected] = useState<string | null>(null);
    const handleSelect = (value: string) => {
        if (selected === value) {
            setSelected(null);
        } else {
            setSelected(value);
        }
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

            <div className="md:w-[90%] mx-auto flex">
                <aside className="hidden py-4 md:w-1/5 lg:w-1/5 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">Filtros</h2>
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
                                        const value = Math.max(0, Number(e.target.value));
                                        e.target.value = value.toString();
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
                                    onChange={(e) => {
                                        const minInput = document.getElementById(
                                            "min_precio"
                                        ) as HTMLInputElement | null;
                                        const minValue = minInput ? Number(minInput.value) : 0;
                                        const value = Math.max(minValue, Number(e.target.value));
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
                        <div className="flex flex-col mb-6">
                            <label htmlFor="orden_precio" className="text-base font-bold mb-2 text-gray-700">
                                Ordenar por
                            </label>

                            <hr className="border-t border-gray-300 mb-4" />
                            <label htmlFor="orden_precio" className="text-sm font-medium mb-3 text-gray-600">
                                Precio
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        id="ninguno-radio"
                                        type="radio"
                                        value="ninguno"
                                        name="orden_precio"
                                        checked={selected === "ninguno"}
                                        onChange={() => handleSelect("ninguno")}
                                        className={`w-5 h-5 ${selected === "ninguno" ? "text-blue-600" : "text-gray-300"
                                            } border-gray-300 focus:ring-blue-500`}
                                    />
                                    <label htmlFor="ninguno-radio" className="ml-3 text-sm font-medium text-gray-700">
                                        Ninguno
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="barato-radio"
                                        type="radio"
                                        value="barato"
                                        name="orden_precio"
                                        checked={selected === "barato"}
                                        onChange={() => handleSelect("barato")}
                                        className={`w-5 h-5 ${selected === "barato" ? "text-blue-600" : "text-gray-300"
                                            } border-gray-300 focus:ring-blue-500`}
                                    />
                                    <label htmlFor="barato-radio" className="ml-3 text-sm font-medium text-gray-700">
                                        Más barato primero
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="caro-radio"
                                        type="radio"
                                        value="caro"
                                        name="orden_precio"
                                        checked={selected === "caro"}
                                        onChange={() => handleSelect("caro")}
                                        className={`w-5 h-5 ${selected === "caro" ? "text-blue-600" : "text-gray-300"
                                            } border-gray-300 focus:ring-blue-500`}
                                    />
                                    <label htmlFor="caro-radio" className="ml-3 text-sm font-medium text-gray-700">
                                        Más caro primero
                                    </label>
                                </div>
                            </div>

                            <hr className="border-t border-gray-300 mt-6" />
                        </div>

                    </div>
                </aside>
                <div className="ml-3">
                    <div className="flex justify-between items-center my-3">
                        <h1 className="text-xl font-semibold">
                            Resultados de la búsqueda "{searchQuery}"
                        </h1>
                    </div>
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
        </div>
    );
};

export default Buscar;
