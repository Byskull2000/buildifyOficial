import imgEjemploPerfil from '../assets/ejemploPerfil.jpg';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md'; // Importar el ícono del mapa

const usuario =
{
    correo_electronico: "pablo@pablo.com",
    estado_usuario: null,
    telefono: 77777777,
    fecha_creacion: null, id_usuario: 1,
    imagen_perfil: null,
    nombre_usuario: "Pablo",
    ultimo_login: null,
    zona_trabajo: "Avenida sexta / 1944 "
};




const page = () => {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
            <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931] font-poppins">
                <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">

                        <h2 className="pl-3 mb-4 text-2xl font-semibold">Ajustes de usuario</h2>
                        {/*Areas de la seccion de perfil*/}
                        <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
                            Perfil publico
                        </a>
                        <a href="#"
                            className="flex items-center px-3 py-2.5 font-bold bg-white  text-yellow-500 border rounded-full">
                            Editar perfil
                        </a>
                        <a href="#"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
                            Notificaciones
                        </a>
                        <a href="#"
                            className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full  ">
                            Algo aca xd
                        </a>
                    </div>
                </aside>
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Editar perfil</h2>

                            <div className="grid max-w-2xl mx-auto mt-8">
                                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                    {/*Aca se carga la imagen de perfil */}
                                    <img className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-orange-300"
                                        src={imgEjemploPerfil}
                                        alt="Avatar redondeado" />

                                    <div className="flex flex-col space-y-5 sm:ml-8">
                                        <button type="button"
                                            className="py-3.5 px-7 text-base font-medium text-white focus:outline-none rounded-lg border border-yellow-300 bg-[#FED35F] hover:bg-yellow-500  focus:z-10 focus:ring-4 focus:ring-orange-600">
                                            Cambiar foto de perfil
                                        </button>
                                        <button type="button"
                                            className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border hover:bg-slate-100      ">
                                            Eliminar foto de perfil
                                        </button>
                                    </div>
                                </div>

                                <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                    <div className="mb-2 sm:mb-6">
                                        <label
                                            className="block mb-2 text-sm font-medium  text-black ">Nombre</label>
                                        <input type="text" id="nombre"
                                            className="bg-yellow-100 border border-orange-200 text-sm rounded-lg block w-full p-2.5 "
                                            placeholder="Tu nombre" required value={usuario.nombre_usuario} pattern="[A-Za-z\s]+" />
                                    </div>
                                    <div className="mb-2 sm:mb-6">
                                        <label
                                            className="block mb-2 text-sm font-medium  ">Numero de teléfono</label>
                                        <input type="number" id="email"
                                            className="bg-yellow-100  border border-orange-200 text-sm rounded-lg  block w-full p-2.5 "
                                            placeholder="Ej: 7777777" required value={usuario.telefono}
                                            onKeyDown={(e) => (e.key === 'e' || e.key === '-' || e.key === '+') && e.preventDefault()} />
                                    </div>

                                    <div className="mb-2 sm:mb-6">
                                        <label
                                            className="block mb-2 text-sm font-medium ">Ubicacion</label>
                                        <div className="flex">
                                            <input type="text" id="location"
                                                className="bg-yellow-100 border border-orange-200 text-black text-sm rounded-lg w-full p-2.5 "
                                                placeholder="Tu ubicacion" required value={usuario.zona_trabajo} />
                                            <button className="ml-2 p-2 bg-yellow-100 border hover:bg-yellow-500 border-orange-200 rounded-lg">
                                                <MdLocationOn className="text-xl text-black" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button type="submit"
                                            className="text-white border-orange-300 bg-[#FED35F] hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                                            Guardar
                                        </button>
                                        <Link to="/">
                                            <button type="button"
                                                className="ml-4 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                                                Cancelar
                                            </button>
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default page;
