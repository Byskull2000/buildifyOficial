import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Page = () => {
    const [nombre_usuario, setNombre] = useState("");
    const [numero_telefono, setTelefono] = useState("");
    const [zona_trabajo, setZonaTrabajo] = useState("");
    const [imagen_perfil, setImagenPerfil] = useState("");
    const [id, setId] = useState("");
    const [correo, setCorreo] = useState("");
    const navigate = useNavigate();
    const [ubicacion, setUbicacion] = useState("");

    useEffect(() => {
        const data =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            null;
        console.log(data);
        if (data) {
            const user = JSON.parse(data);
            setId(user.id_usuario || "");
            setNombre(user.nombre_usuario || "");
            setTelefono(user.numero_telefono || "");
            setZonaTrabajo(user.zona_trabajo || "");
            setImagenPerfil(user.imagen_perfil || imgEjemploPerfil);
            setCorreo(user.correo_electronico)
            setUbicacion(user.zona_trabajo)
        }
    }, []);

    // Función para manejar el submit del formulario
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedProfile = {
            nombre_usuario,
            numero_telefono,
            zona_trabajo,
        };

        try {
            const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
            const response = await fetch(URL_BACKEND + `/api/usuarios/${id}/perfil`, // Asegúrate de que la URL coincida con tu backend
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedProfile),
                }
            );

            const data = await response.json();
            if (response.ok) {
                alert("Perfil actualizado exitosamente");

                console.log("data: ");
                if (sessionStorage.getItem("user")) {
                    sessionStorage.setItem("user", JSON.stringify(data.data));
                } else {
                    localStorage.setItem("user", JSON.stringify(data.data));
                }

                navigate("/");
            } else {
                console.error("Error al actualizar el perfil", data);
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
        }
    };

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap"
                rel="stylesheet"
            />
            <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931] font-poppins">
                <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
                    <Link to="/" className="p-4 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="lg:w-6 lg:h-6 lg:mt-5 h-4 w-4 mt-5"
                                viewBox="0 0 448 512"
                            >
                                <path
                                    fill="#000000"
                                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                                />
                            </svg>
                        </Link>
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">
                            Ajustes de usuario
                        </h2>
                        {/*Areas de la seccion de perfil*/}
                        <a
                            href="#"
                            className="flex items-center px-3 py-2.5 font-bold bg-white  text-yellow-500 border rounded-full"
                        >
                            Perfil publico
                        </a>
                        <Link to="/editProfile">
                            <a
                                href="#"
                                className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                            >
                                Editar perfil
                            </a>
                        </Link>
                        <a
                            href="#"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                        >
                            Notificaciones
                        </a>
                        <button
                            onClick={() => {
                                localStorage.removeItem('user')
                                sessionStorage.removeItem('user')
                                navigate('/')
                            }}
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full  "
                        >
                            Cerrar Sesion
                        </button>
                    </div>
                </aside>
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                                Perfil público
                            </h2>

                            <div className="grid max-w-2xl mx-auto mt-8">
                                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                    {/*Aca se carga la imagen de perfil */}
                                    <img
                                        className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-orange-300"
                                        src={imagen_perfil}
                                    />

                                    <div className="flex flex-col space-y-5 sm:ml-8">
                                        {/*Aca cargar el nomnbre*/}
                                        <h1 className="font-bold text-2xl">
                                            {nombre_usuario}
                                        </h1>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} method="PUT">
                                    <div className="items-center mt-8 sm:mt-14 ml-10">
                                        <div>
                                            <label className="block mb-2 text-md font-medium text-black ">
                                                Correo electrónico
                                            </label>
                                            {/*Aca cargar el correo*/}
                                            <label className="text-md mt-2 mb-8">{correo}</label>
                                        </div>
                                        <hr className="border-gray-200 my-4" />
                                        <div>
                                            <label className="block mb-2 text-md font-medium text-black ">
                                                Teléfono
                                            </label>
                                            {/*Aca cargar el telefono*/}
                                            <label className="text-md mt-2 mb-8 text-black">{numero_telefono}</label>
                                        </div>
                                        <hr className="border-gray-200 my-4" />
                                        <div className="mt-6 sm:mb-6">
                                            <label className="block mb-2 text-md font-medium text-black ">
                                                Ubicacion
                                            </label>
                                            {/*Aca cargar la ubicacion, redirigir a la ubicacion desde aca o mostrar el mapa desde aca, cargar el mapa igualmente*/}
                                            <label className="text-md mt-2 mb-8 hover:underline hover:text-blue-400 text-gray-700">{ubicacion}</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Page;