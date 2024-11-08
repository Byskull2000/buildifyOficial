import { useEffect, useState } from "react";
import type { MaterialProp } from "../../components/Material";
import { URL_BACKEND } from "../../constant/url";
import Material from "../../components/Material";

// eslint-disable-next-line react-refresh/only-export-components
export const fetchRecomendados = async (
    id_usuario: number,
    ciudad: string,
    setMateriales: (data: MaterialProp[]) => void
) => {
    try {
        const res = await fetch(`${URL_BACKEND}/api/materiales/filtrar_interes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_usuario, ciudad }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error("Error fetching data");
        }
        setMateriales(data.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
const MaterialesRecomendados = ({ id_usuario, ciudad }: { id_usuario: number; ciudad: string }) => {
    const [materiales, setMateriales] = useState<MaterialProp[]>([]);
    useEffect(() => {
        fetchRecomendados(id_usuario, ciudad, setMateriales);
    }, []);
    return (
        <div>
            <h1 className="w-full text-3xl text-center font-bold py-4">
                Materiales Recomendados
            </h1>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 place-items-center">
                {materiales.length > 0 ? (
                    materiales.map((material) => (
                        <Material
                            key={material.id_material}
                            material={material}
                        />
                    ))
                ) : (
                    <h2 className="text-xl">No se encontraron resultados</h2>
                )}
            </div>
        </div>
    );
};

export default MaterialesRecomendados;
