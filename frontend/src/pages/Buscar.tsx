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

            <div className="md:w-[90%] mx-auto ">
                <h1 className="text-xl font-semibold my-3">
                    Resultados de la busqueda "{searchQuery}"
                </h1>

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
