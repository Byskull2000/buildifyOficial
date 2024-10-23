import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

import material1 from "../assets/material1.png";
import material2 from "../assets/material2.png";
import material3 from "../assets/material3.png";
import material4 from "../assets/material4.png";
import material5 from "../assets/material5.png";
import type { MaterialProp } from "../components/Material";
import Material from "../components/Material";

const Buscar = () => {
    const searchQuery = new URLSearchParams(location.search).get("query");
    const [resultados, setResultados] = useState<MaterialProp[]>([]);
    useEffect(() => {
        const resultados = [
            {
                id: 1,
                imagenUrl: material1,
                precio: 200,
                titulo: "Ladrillos 6 huecos",
            },
            {
                id: 2,
                imagenUrl: material2,
                precio: 200,
                titulo: "Ladrillos 6 huecos",
            },
            {
                id: 3,
                imagenUrl: material3,
                precio: 200,
                titulo: "Ladrillos 6 huecos",
            },
            {
                id: 4,
                imagenUrl: material4,
                precio: 200,
                titulo: "Ladrillos 6 huecos",
            },
            {
                id: 5,
                imagenUrl: material5,
                precio: 80,
                titulo: "Arena lavada",
            },
        ];

        setResultados(resultados);
    }, []);

    return (
        <div>
            <NavBar buscar={searchQuery?.toString()} />

            <div className="md:w-[90%] mx-auto">
                <h1 className="text-xl font-semibold my-3">
                    Resultados de la busqueda "{searchQuery}"
                </h1>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 place-items-center">
                    {resultados.map((material) => (
                        <Material key={material.id} material={material} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Buscar;
