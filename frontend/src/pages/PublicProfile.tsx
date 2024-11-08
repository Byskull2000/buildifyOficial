import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleNavBar from "../components/simpleNavBar";
import material1 from "../assets/material1.png";
import material2 from "../assets/material2.png";
import material3 from "../assets/material3.png";
import material4 from "../assets/material4.png";
import material5 from "../assets/material5.png";
import { MaterialProp } from "../components/Material";
import { Link } from "react-router-dom";
import ListarPropios from "../components/ListarPropios";
import { URL_BACKEND } from "../constant/url";
const Page = () => {
    const [nombre_usuario, setNombre] = useState("");
    //const [numero_telefono, setTelefono] = useState("");
    const [zona_trabajo, setZonaTrabajo] = useState("");
    const [imagen_perfil, setImagenPerfil] = useState("");
    //const [id, setId] = useState("");
    const navigate = useNavigate();
    // Ejemplo de datos; estos valores deberían venir del backend.
    const [propios, setPropios] = useState<MaterialProp[]>([]);

    const getMaterialesPropios = async () => {
        const user =
            (await localStorage.getItem("user")) ||
            (await sessionStorage.getItem("user")) ||
            null;
        if (user) {
            const { id_usuario } = JSON.parse(user);
            const response = await fetch(
                `${URL_BACKEND}/api/materiales/usuario/${id_usuario}`
            );
            const data = await response.json();
            if (response.ok) {
                console.log("materiales",data.data);
                setPropios(data.data)
            } else {
                console.error("Error al obtener los materiales propios", data);
            }
        }
    };
    //Esta lista reemplazar por la API de similares
    useEffect(() => {
        // esta lista debe ser reemplazada por la API de recomendados

        const propios = [
            {
                id_material: 1,
                imagenUrl: material1,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 2,
                imagenUrl: material2,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 3,
                imagenUrl: material3,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 4,
                imagenUrl: material4,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 5,
                imagenUrl: material5,
                precio_material: 80,
                nombre_material: "Arena lavada",
            },
        ];

        setPropios(propios);
        getMaterialesPropios();
    }, []);

    useEffect(() => {
        const data =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            null;
        if (data) {
            const user = JSON.parse(data);
            console.log(user);
            //      setId(user.id_usuario || "");
            setNombre(user.nombre_usuario || "");
            //    setTelefono(user.numero_telefono || "");
            setZonaTrabajo(user.zona_trabajo || "");
            setImagenPerfil(user.imagen_perfil || imgEjemploPerfil);
        }
    }, []);

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap"
                rel="stylesheet"
            />
            <SimpleNavBar></SimpleNavBar>
            <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931] font-poppins ">
                <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">
                            Ajustes de usuario
                        </h2>
                        {/*Areas de la seccion de perfil*/}
                        <a
                            href="/profile"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
                        >
                            Mi cuenta
                        </a>
                        <a
                            href="/publicProfile"
                            className="flex items-center px-3 py-2.5 font-bold bg-white  text-yellow-500 border rounded-full"
                        >
                            Perfil Comercial
                        </a>
                        <a
                            href="/editProfile"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                        >
                            Editar perfil
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                        >
                            Notificaciones
                        </a>
                        <button
                            onClick={() => {
                                localStorage.removeItem("user");
                                sessionStorage.removeItem("user");
                                navigate("/");
                            }}
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full  "
                        >
                            Cerrar Sesion
                        </button>
                    </div>
                </aside>
                <main className=" min-h-screen py-1 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="text-2xl font-bold sm:text-xl">
                                Perfil de usuario
                            </h2>
                            <div className="w-full mx-auto mt-8">
                                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:justify-between sm:items-center">
                                    {/* Imagen de perfil */}
                                    <img
                                        className="object-cover w-40 h-40 p-1 rounded-lg ring-2 ring-orange-300"
                                        src={imagen_perfil}
                                    />

                                    <div className="flex flex-col space-y-2 ml-8 -mt-10 mb-10">
                                        {/* Nombre */}
                                        <h1 className="font-bold text-2xl whitespace-nowrap">
                                            {nombre_usuario}
                                        </h1>

                                        {/* Ubicación */}
                                        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5"
                                                viewBox="0 0 384 512"
                                            >
                                                <path
                                                    fill="#FFD43B"
                                                    d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                                                />
                                            </svg>
                                            <label className="text-sm hover:underline hover:text-blue-400 text-gray-700">
                                                {zona_trabajo}
                                            </label>
                                        </div>

                                        {/* Calificación */}
                                        <div className="flex items-center space-x-2">
                                            {/* Ícono Estrella */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 576 512"
                                            >
                                                <path
                                                    fill="#FFD43B"
                                                    d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                                />
                                            </svg>

                                            {/* Calificación */}
                                            <label className="text-sm hover:underline hover:text-blue-400 text-gray-700">
                                                9.2/10
                                            </label>
                                        </div>

                                        {/* Botón Contactar */}
                                        <div className="mt-2">
                                            <button className="flex items-center text-white bg-yellow-400 rounded-md px-2 py-1 space-x-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <path
                                                        fill="#ffffff"
                                                        d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z"
                                                    />
                                                </svg>
                                                <span>Contacto</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold sm:text-xl mt-10">
                                    Reseñas
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mt-10">
                            <h2 className="text-2xl font-bold sm:text-xl">
                                Catálogo de venta
                            </h2>
                            <Link to="/propios">
                                <a
                                    href="#ver-todo"
                                    className="text-[#FDBC3F] hover:underline"
                                >
                                    Ver Todo
                                </a>
                            </Link>
                        </div>
                        <ListarPropios materiales={propios} />
                    </div>
                </main>
            </div>
        </>
    );
};

export default Page;
