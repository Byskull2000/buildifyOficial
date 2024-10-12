"use client";
import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import { Link, useNavigate } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Cropper from "react-easy-crop";

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
    const [imagenRecortada, setImagenRecortada] = useState<Blob | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

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

    const createImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.crossOrigin = "anonymous"; // To avoid CORS issues
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };

    const getCroppedImg = async (
        imageSrc: string,
        crop: { x: number; y: number; width: number; height: number }
    ) => {
        // Función para generar un hash basado en SHA-256
        async function generateHash(input: string) {
            const textEncoder = new TextEncoder();
            const encodedData = textEncoder.encode(input);
            const hashBuffer = await crypto.subtle.digest(
                "SHA-256",
                encodedData
            );
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            return hashHex;
        }
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        const timestamp = new Date().toISOString();
        const hash = await generateHash(`${id}-${timestamp}`);

        return new Promise<File | null>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    // Asignar nombre al archivo con el hash generado
                    const fileName = `${hash}.webp `;

                    // Convertir el blob en un archivo con el nombre generado
                    const file = new File([blob], fileName, {
                        type: "image/webp",
                    });
                    resolve(file);
                } else {
                    resolve(null);
                }
            }, "image/webp");
        });
    };

    const onCropComplete = async (
        croppedArea: { x: number; y: number; width: number; height: number },
        croppedAreaPixels: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    ) => {
        console.log(croppedArea);
        const croppedImage = await getCroppedImg(
            imagen_perfil,
            croppedAreaPixels
        );
        setImagenRecortada(croppedImage); // Guardar la imagen recortada para mostrarla
    };

    const handleSaveImage = async () => {
        if (imagenRecortada) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImagenPerfil(reader.result.toString());
                }
            };
            reader.readAsDataURL(imagenRecortada);
        }
        setImagenSeleccionada(null);
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("nombre_usuario", nombre_usuario);
        formData.append("numero_telefono", numero_telefono);
        formData.append("zona_trabajo", zona_trabajo);

        if (imagenRecortada) {
            formData.append("imagen_perfil", imagenRecortada);
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
                                    {imagenSeleccionada ? (
                                        <div>
                                            <div className="relative w-full h-80 bg-black">
                                                <Cropper
                                                    image={imagen_perfil}
                                                    crop={crop}
                                                    zoom={zoom}
                                                    aspect={1 / 1}
                                                    onCropChange={setCrop}
                                                    onCropComplete={
                                                        onCropComplete
                                                    }
                                                    onZoomChange={setZoom}
                                                    cropShape="round"
                                                />
                                            </div>
                                            <div className="flex justify-around my-2">
                                                <button
                                                    className="py-3.5 px-7 text-base font-medium text-white focus:outline-none rounded-lg border border-yellow-300 bg-[#FED35F] hover:bg-yellow-500  focus:z-10 focus:ring-4 focus:ring-orange-600"
                                                    onClick={handleSaveImage}
                                                >
                                                    Guardar Imagen
                                                </button>
                                                <button
                                                    className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border hover:bg-slate-100"
                                                    onClick={() => {
                                                        setImagenSeleccionada(
                                                            null
                                                        );
                                                        setImagenPerfil(
                                                            imagen_original
                                                        );
                                                    }}
                                                >
                                                    Restaurar Imagen
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
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
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border hover:bg-slate-100      "
                                                    onClick={() => {
                                                        setImagenSeleccionada(
                                                            null
                                                        );
                                                        setImagenPerfil(
                                                            imagen_original
                                                        );
                                                    }}
                                                >
                                                    Eliminar foto de perfil
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
