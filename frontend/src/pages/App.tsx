// Todas las imagenes deben estar en /src/assets
import NavBar from "../components/NavBar";
import PopupRegristro from "../components/RegistroRapidoPP";
import ImagenPrueba from "../pages/ImagenPrueba";
import InterestList from "../components/InteresList";
//import { Link } from "react-router-dom";
import DireccionesEntrega from "./DireccionesEntrega";
import { useEffect, useState } from "react";
import material1 from "../assets/material1.png";
import material2 from "../assets/material2.png";
import material3 from "../assets/material3.png";
import material4 from "../assets/material4.png";
import material5 from "../assets/material5.png";
import { MaterialProp } from "../components/Material";
import { Link } from "react-router-dom";
import ListarMateriales from "../components/ListarMateriales";

function App() {
    const userStorage =
        sessionStorage.getItem("user") || localStorage.getItem("user") || null;
    const user = userStorage ? JSON.parse(userStorage) : null;

    const [recomendados, setRecomendados] = useState<MaterialProp[]>([]);

    useEffect(() => {
        // esta lista debe ser reemplazada por la API de recomendados
        const recomendados = [
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

        setRecomendados(recomendados);
    }, []);

    return (
        <>
            <NavBar />
            <div className="bg-white  w-[90%] mx-auto">
                <h2 className="flex justify-center">
                    Bienvenido {user ? user.nombre_usuario : "Invitado"}
                </h2>
                {!user && <PopupRegristro></PopupRegristro>}

                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl md:text-2xl ">
                        Recomendados para ti
                    </h2>
                    <Link
                        to={"/materiales/recomendados"}
                        className="text-[#FDBC3F]"
                    >
                        Ver Mas
                    </Link>
                </div>
                <ListarMateriales materiales={recomendados} />

                <ImagenPrueba></ImagenPrueba>
                <InterestList></InterestList>
                <DireccionesEntrega />
            </div>
        </>
    );
}

export default App;
