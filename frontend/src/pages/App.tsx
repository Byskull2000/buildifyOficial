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
import Categorias from "../components/Categorias";
import FormEliminacion from "../components/formEliminacion";

function App() {
    const userStorage =
        sessionStorage.getItem("user") || localStorage.getItem("user") || null;
    const user = userStorage ? JSON.parse(userStorage) : null;

    const [recomendados, setRecomendados] = useState<MaterialProp[]>([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    useEffect(() => {
        // esta lista debe ser reemplazada por la API de recomendados
        const recomendados = [
            {
                id_material: 5,
                imagenUrl: material5,
                precio_material: 80,
                nombre_material: "Arena lavada",
                tipo_unidad_material: "Kilogramo",
                estado_material: "Usado",
            },
            {
                id_material: 1,
                imagenUrl: material1,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
                tipo_unidad_material: "Docena",
                estado_material: "Nuevo",
            },
            {
                id_material: 2,
                imagenUrl: material2,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
                tipo_unidad_material: "Docena",
                estado_material: "Usado",
            },
            {
                id_material: 3,
                imagenUrl: material3,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
                tipo_unidad_material: "Docena",
                estado_material: "Usado",
            },
            {
                id_material: 4,
                imagenUrl: material4,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
                tipo_unidad_material: "Docena",
                estado_material: "Usado",
            },
        ];

        setRecomendados(recomendados);
    }, []);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    // Función para manejar la confirmación de eliminación
    const handleConfirm = (motivo: string) => {
        console.log("Material eliminado por el motivo:", motivo);
        setIsPopupVisible(false);
    };

    // Función para manejar la cancelación de eliminación
    const handleCancel = () => {
        setIsPopupVisible(false);
    };

    return (
        <>
            <NavBar />
            <div className="flex justify-end items-start mt-5 mr-5">
                <button className="py-2 bg-blue-600 text-white p-2 font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">
                    Registrar material
                </button>
            </div>

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
                <DireccionesEntrega />
                <Link to={"/matRegister"}></Link>
                <button
                    className="mt-5 mb-2 py-2 bg-red-600 text-white p-2 font-semibold rounded-lg hover:bg-red-700 focus:outline-none"
                    onClick={togglePopup}
                >
                    Eliminar Material
                </button>

                {/* Mostrar el PopUp de eliminación solo si el estado está activo */}
                {isPopupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                        <FormEliminacion
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                        />
                        <button
                            onClick={togglePopup}
                            className="absolute top-0 right-0 m-4 text-white bg-black p-2 rounded-full hover:bg-gray-800"
                        >
                            Cerrar
                        </button>
                    </div>
                )}
                {!user && <PopupRegristro />}
            </div>
        </>
    );
}

export default App;
