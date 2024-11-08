// Todas las imagenes deben estar en /src/assets
import NavBar from "../components/NavBar";
import ImagenPrueba from "../pages/ImagenPrueba";
import InterestList from "../components/InteresList";
//import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { MaterialProp } from "../components/Material";
import { Link } from "react-router-dom";
import ListarMateriales from "../components/ListarMateriales";
import Categorias from "../components/Categorias";
import { fetchRecomendados } from "./materiales/MaterialesRecomendados";


function App() {
    const userStorage =
        sessionStorage.getItem("user") || localStorage.getItem("user") || null;
    const user = userStorage ? JSON.parse(userStorage) : null;

    const [recomendados, setRecomendados] = useState<MaterialProp[]>([]);



    useEffect(() => {
        fetchRecomendados(setRecomendados);
    }, []);

    return (
        <>
            <NavBar />
            {user && (
                <Link to={"/matRegister"}>
                    <div className="flex justify-end items-start mt-5 mr-5">
                        <button className="py-2 bg-blue-600 text-white p-2 font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">
                            Registrar material
                        </button>
                    </div>
                </Link>
            )}

            <div className="bg-white w-[90%] mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="font-semibold text-xl md:text-2xl ">
                        Categorías
                    </h2>
                    <Link
                        to={"/materiales/recomendados"}
                        className="text-[#FDBC3F]"
                    >
                        Ver Mas
                    </Link>
                </div>
                <Categorias />
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
                <ImagenPrueba />
                <InterestList />
            </div>
        </>
    );
}

export default App;
