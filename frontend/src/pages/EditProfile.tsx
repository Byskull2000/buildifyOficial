import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import { Link, useNavigate } from "react-router-dom";
import { MdLocationOn } from "react-icons/md"; // Importar el ícono del mapa
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

const Page = () => {
    const [nombre_usuario, setNombre] = useState("");
    const [numero_telefono, setTelefono] = useState("");
    const [zona_trabajo, setZonaTrabajo] = useState("");
    const [imagen_perfil, setImagenPerfil] = useState(imgEjemploPerfil);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(
        null
    );
    const [imagen_original, setImagenOriginal] = useState(imgEjemploPerfil);
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const data =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            null;
        if (data) {
            const user = JSON.parse(data);
            setId(user.id_usuario || "");
            setNombre(user.nombre_usuario || "");
            setTelefono(user.numero_telefono || "");
            setZonaTrabajo(user.zona_trabajo || "");
            setImagenPerfil(user.imagen_perfil || imgEjemploPerfil);
            setImagenOriginal(user.imagen_perfil || imgEjemploPerfil);
        }
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setImagenSeleccionada(file); // Guardamos la imagen seleccionada
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && typeof e.target.result === "string") {
                    setImagenPerfil(e.target.result); // Actualizamos la vista previa de la imagen
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Función para manejar el submit del formulario
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("nombre_usuario", nombre_usuario);
        formData.append("numero_telefono", numero_telefono);
        formData.append("zona_trabajo", zona_trabajo);

        if (imagenSeleccionada) {
            formData.append("imagen_perfil", imagenSeleccionada);
        }

        try {
            const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
            const response = await fetch(
                `${URL_BACKEND}/api/usuarios/${id}/perfil`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            setLoading(false);
            const data = await response.json();
            if (response.ok) {
                alert("Perfil actualizado exitosamente");

                if (sessionStorage.getItem("user")) {
                    sessionStorage.setItem("user", JSON.stringify(data.data));
                } else {
                    localStorage.setItem("user", JSON.stringify(data.data));
                }
                navigate("/");
            } else {
                setError(data.message || "Error al actualizar los datos");
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
        }
        setLoading(false);
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
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">
                            Ajustes de usuario
                        </h2>
                        {/*Areas de la seccion de perfil*/}
                        <a
                            href="#"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
                        >
                            Perfil publico
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-3 py-2.5 font-bold bg-white  text-yellow-500 border rounded-full"
                        >
                            Editar perfil
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                        >
                            Notificaciones
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full  "
                        >
                            Campo a futuro
                        </a>
                    </div>
                </aside>
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="p-2 md:p-4">
                            <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                                <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                                    Editar perfil
                                </h2>
                                <div className="grid max-w-2xl mx-auto mt-8">
                                    <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                        {/*Aca se carga la imagen de perfil */}
                                        <img
                                            className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-orange-300"
                                            src={
                                                imagen_perfil ||
                                                imgEjemploPerfil
                                            }
                                            alt="Avatar"
                                        />
                                        <div className="flex flex-col space-y-5 sm:ml-8">
                                            <label
                                                htmlFor="file_avatar"
                                                className="py-3.5 px-7 text-base font-medium text-white focus:outline-none rounded-lg border border-yellow-300 bg-[#FED35F] hover:bg-yellow-500  focus:z-10 focus:ring-4 focus:ring-orange-600"
                                            >
                                                Cambiar foto de perfil
                                                <input
                                                    id="file_avatar"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border hover:bg-slate-100      "
                                                onClick={() => {
                                                    setImagenSeleccionada(null);
                                                    setImagenPerfil(
                                                        imagen_original
                                                    );
                                                }}
                                            >
                                                Eliminar foto de perfil
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} method="PUT">
                                        <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                            <label className="block mb-2 text-sm font-medium  text-black">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                className="bg-yellow-100 border border-orange-200 text-sm rounded-lg block w-full p-2.5 "
                                                placeholder="Tu nombre"
                                                required
                                                value={nombre_usuario}
                                                pattern="[A-Za-z\s]+"
                                                onChange={(e) =>
                                                    setNombre(e.target.value)
                                                }
                                            />

                                            <label className="block mb-2 text-sm font-medium ">
                                                Telefono
                                            </label>
                                            <input
                                                type="tel"
                                                className="bg-yellow-100 border border-orange-200 text-sm rounded-lg block w-full p-2.5"
                                                placeholder="Ej: +591 12345678"
                                                required
                                                value={numero_telefono}
                                                onChange={(e) => {
                                                    const valor =
                                                        e.target.value.replace(
                                                            /[^+\d\s-]/g,
                                                            ""
                                                        ); // Permite solo +, dígitos, espacios y guiones
                                                    setTelefono(valor);
                                                }}
                                            />
                                            <div className="mb-2 sm:mb-6">
                                                <label className="block mb-2 text-sm font-medium ">
                                                    Ubicacion
                                                </label>
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        className="bg-yellow-100 border border-orange-200 text-black text-sm rounded-lg w-full p-2.5 "
                                                        placeholder="Tu ubicacion"
                                                        required
                                                        value={zona_trabajo}
                                                        onChange={(e) =>
                                                            setZonaTrabajo(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button className="ml-2 p-2 bg-yellow-100 border hover:bg-yellow-500 border-orange-200 rounded-lg">
                                                        <MdLocationOn className="text-xl text-black" />
                                                    </button>
                                                </div>
                                            </div>
                                            {error && (
                                                <p style={{ color: "red" }}>
                                                    {error}
                                                </p>
                                            )}
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="text-white border-orange-300 bg-[#FED35F] hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                                >
                                                    Guardar
                                                </button>
                                                <Link to="/">
                                                    <button
                                                        type="button"
                                                        className="ml-4 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default Page;
