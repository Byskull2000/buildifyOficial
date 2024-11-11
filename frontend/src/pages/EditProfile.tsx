"use client";
import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import imgEjemploQR from "../assets/EjemploQR.png";
import { Link, useNavigate } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Cropper from "react-easy-crop";
import Mapa from "../components/Mapa";
import SimpleNavBar from "../components/simpleNavBar"

interface Ubicacion {
    lat: number;
    lng: number;
}
const Page = () => {
    const [openMap, setOpenMap] = useState(false);
    const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] =
        useState<Ubicacion | null>(null);
    const [nombre_usuario, setNombre] = useState("");
    const [cod_pais, setCodPais] = useState("+591");
    const [numero_telefono, setTelefono] = useState("");
    const [zona_trabajo, setZonaTrabajo] = useState("");
    const [imagen_perfil, setImagenPerfil] = useState(imgEjemploPerfil);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(
        null
    );
    const [imagen_original, setImagenOriginal] = useState(imgEjemploPerfil);
    const [imagen_QR, setImagen_QR] = useState(imgEjemploQR);
    const [imagenQRSeleccionada, setimagenQRSeleccionada] = useState<File | null>(
        null
    );
    const [QROriginal, setQROriginal] = useState(imgEjemploQR);
    const [imagenQRRecortada, setImagenQRRecortada] = useState<Blob | null>(null);
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [imagenRecortada, setImagenRecortada] = useState<Blob | null>(null);
    const [crop2, setCrop2] = useState({ x: 0, y: 0 });
    const [zoom2, setZoom2] = useState(1);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [zonas, setZonas] = useState<string[]>([]); // Nuevo estado para almacenar las zonas

    const obtenerZonaPorCoordenadas = async (lat: number, lng: number) => {
        try {
            // Aquí iría tu lógica para obtener la zona, por ejemplo, mediante una API o un arreglo local
            const response = await fetch(`tu_api_zonas?lat=${lat}&lng=${lng}`);
            const data = await response.json();
            setZonas(data.zonas); // Asumiendo que la respuesta contiene un campo 'zonas'
        } catch (error) {
            console.error("Error al obtener las zonas", error);
        }
    };

    useEffect(() => {
        const data =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            null;
        if (data) {
            const user = JSON.parse(data);
            setId(user.id_usuario || "");
            setNombre(user.nombre_usuario || "");
            const telf = user.numero_telefono
                ? user.numero_telefono.split(" ")[1]
                : "";
            setTelefono(telf);
            setZonaTrabajo(user.zona_trabajo || "");
            setImagenPerfil(user.imagen_perfil || imgEjemploPerfil);
            setImagenOriginal(user.imagen_perfil || imgEjemploPerfil);
            setImagen_QR(user.imagen_QR|| imgEjemploQR); //CAMBIAR ACA
            setQROriginal(user.imagen_QR || imgEjemploQR); //CAMBIAR EL USER
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

    const handleImageChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setimagenQRSeleccionada(file); // Guardamos la imagen seleccionada
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && typeof e.target.result === "string") {
                    setImagen_QR(e.target.result); // Actualizamos la vista previa de la imagen
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
        setImagenRecortada(croppedImage);
    };
    const onCropComplete2 = async (
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
            imagen_QR,
            croppedAreaPixels
        );
        setImagenQRRecortada(croppedImage);
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
    const handleSaveImage2 = async () => {
        if (imagenQRRecortada) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImagen_QR(reader.result.toString());
                }
            };
            reader.readAsDataURL(imagenQRRecortada);
        }
        setimagenQRSeleccionada(null);
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nombre_usuario", nombre_usuario);
        formData.append("numero_telefono", cod_pais + " " + numero_telefono);
        formData.append("zona_trabajo", zona_trabajo);
        if (coordenadasSeleccionadas) {
            formData.append("latitud", coordenadasSeleccionadas.lat.toString());
            formData.append(
                "longitud",
                coordenadasSeleccionadas.lng.toString()
            );
        }

        if (numero_telefono.length < 8) {
            setError("El número de teléfono debe tener al menos 8 dígitos");
            return;
        }

        if (imagenRecortada) {
            formData.append("imagen_perfil", imagenRecortada);
        }

        try {
            setLoading(true);
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
            <SimpleNavBar></SimpleNavBar>
            <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931] font-poppins">
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
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full"
                        >
                            Perfil Comercial
                        </a>
                        <a
                            href="/editProfile"
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
                                    <h2 className="pl-6 text-2xl font-bold sm:text-xl mt-5 mb-5">QR para pagos</h2>
                                    {imagenQRSeleccionada ? (
                                        <div>
                                            <div className="relative w-full h-80 bg-black">
                                                <Cropper
                                                    image={imagen_QR}
                                                    crop={crop2}
                                                    zoom={zoom2}
                                                    aspect={1}
                                                    onCropChange={setCrop2}
                                                    onCropComplete={onCropComplete2}
                                                    onZoomChange={setZoom2}
                                                    cropShape="rect"
                                                />
                                            </div>
                                            <div className="flex justify-around my-2">
                                                <button
                                                    className="py-3.5 px-7 text-base font-medium text-white focus:outline-none rounded-lg border border-yellow-300 bg-[#FED35F] hover:bg-yellow-500 focus:z-10 focus:ring-4 focus:ring-orange-600"
                                                    onClick={handleSaveImage2}
                                                >
                                                    Guardar Imagen
                                                </button>
                                                <button
                                                    className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border hover:bg-slate-100"
                                                    onClick={() => {
                                                        setimagenQRSeleccionada(null);
                                                        setImagen_QR(QROriginal)
                                                    }}
                                                >
                                                    Restaurar Imagen
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                            <img
                                                className="object-cover w-40 h-40 p-1 rounded ring-2 ring-orange-300"
                                                src={imagen_QR || imgEjemploQR}
                                                alt="QR"
                                            />
                                            <div className="flex flex-col space-y-5 sm:ml-8">
                                                <label
                                                    htmlFor="QR_perfil"
                                                    className="py-3.5 px-7 text-base font-medium text-white focus:outline-none rounded-lg border border-yellow-300 bg-[#FED35F] hover:bg-yellow-500 focus:z-10 focus:ring-4 focus:ring-orange-600"
                                                >
                                                    Cambiar QR de pagos
                                                    <input
                                                        id="QR_perfil"
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleImageChange2}
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border hover:bg-slate-100"
                                                    onClick={() => {
                                                        setimagenQRSeleccionada(null);
                                                        setImagen_QR(QROriginal);
                                                    }}
                                                >
                                                    Eliminar QR de pagos
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
                                                className="bg-yellow-100 border border-orange-200 text-sm rounded-lg block w-full p-2.5"
                                                placeholder="Tu nombre"
                                                required
                                                value={nombre_usuario}
                                                onChange={(e) => {
                                                    const valor =
                                                        e.target.value.replace(
                                                            /[^A-Za-z\sñÑ]/g,
                                                            ""
                                                        );
                                                    setNombre(valor);
                                                }}
                                            />
                                            <label className="block mb-2 text-sm font-medium ">
                                                Telefono
                                            </label>
                                            <div className="flex space-x-2 mb-2">
                                                <select
                                                    defaultValue={cod_pais}
                                                    className="bg-yellow-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                                    onChange={(e) =>
                                                        setCodPais(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="+591">
                                                        +591
                                                    </option>
                                                    <option value="+31">
                                                        +31
                                                    </option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    className="bg-yellow-100 border border-orange-200 text-sm rounded-lg block w-full p-2.5"
                                                    placeholder="Ej: 77777777"
                                                    required
                                                    value={numero_telefono}
                                                    onChange={(e) => {
                                                        const valor =
                                                            e.target.value.replace(
                                                                /[^+\d-]/g,
                                                                ""
                                                            ); // Permite solo +, dígitos, espacios y guiones
                                                        if (valor.length <= 8) {
                                                            setTelefono(valor);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-3 w-3/5">
                                                <label className="block mb-2 text-sm font-medium ml-2">Ubicación</label>
                                                <div className="flex mt-1">
                                                    <input
                                                        type="text"
                                                        className="bg-yellow-100 border border-orange-200 text-black text-sm rounded-lg w-full p-2.5"
                                                        placeholder="Tu ubicación"
                                                        required
                                                        value={zona_trabajo} // Debe contener la dirección formateada
                                                        onChange={(e) => setZonaTrabajo(e.target.value)}
                                                    />
                                                    <div
                                                        onClick={() => setOpenMap(!openMap)}
                                                        className="ml-2 p-2 bg-yellow-100 border hover:bg-yellow-500 border-orange-200 rounded-lg hover:cursor-pointer"
                                                    >
                                                        <MdLocationOn className="text-xl text-black" />
                                                    </div>
                                                </div>
                                                {openMap && (
                                                    <div
                                                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                                        onClick={() => setOpenMap(false)}
                                                    >
                                                        <div
                                                            className="bg-white p-6 rounded-lg w-full max-w-2xl h-[400px] lg:h-[600px] flex flex-col"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Mapa
                                                                onUbicacionSeleccionada={(lat: number, lng: number) => {
                                                                    setCoordenadasSeleccionadas({ lat, lng });
                                                                    obtenerZonaPorCoordenadas(lat, lng); // Obtener zona cuando se selecciona una ubicación
                                                                    setOpenMap(false);
                                                                }}
                                                                onDireccionObtenida={(direccion: string) => {
                                                                    // Divide la dirección en partes
                                                                    const partes = direccion.split(' ');

                                                                    // Obtiene los últimos 3 elementos de la dirección
                                                                    const zona = partes.slice(-3).join(' '); // 'zona departamento país'
                                                                    setZonaTrabajo(zona); // Actualiza zona de trabajo con los últimos 3 campos
                                                                }}
                                                                className="w-full h-full"
                                                            />
                                                            <div className="mt-4 flex justify-end">
                                                                <button
                                                                    className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-red-700 transition-colors duration-300"
                                                                    onClick={() => setOpenMap(false)}
                                                                >
                                                                    Cerrar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {zonas.length > 0 && (
                                                    <div className="mt-4">
                                                        <h3 className="font-semibold">Zonas seleccionadas:</h3>
                                                        <ul className="list-disc pl-5">
                                                            {zonas.map((zona, index) => (
                                                                <li key={index}>{zona}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            {error && (
                                                <p className="text-red-600 py-1">
                                                    {error}
                                                </p>
                                            )}
                                            <div className="flex justify-end mt-3">
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
