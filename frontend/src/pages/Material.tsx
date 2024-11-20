import { useState, useEffect } from "react";
import Header from "../components/simpleNavBar";
import { useParams } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import material1 from "../assets/material1.png";
import material2 from "../assets/material2.png";
import material3 from "../assets/material3.png";
import material4 from "../assets/material4.png";
import material5 from "../assets/material5.png";
import { MaterialProp } from "../components/Material";
import ListarMateriales from "../components/ListarMateriales";

const Material = () => {
    const { id } = useParams<{ id: string }>();

    const [materialData, setMaterialData] = useState<MaterialProp | null>(null);

    const [similares, setSimilares] = useState<MaterialProp[]>([]);

    // Estado solo de lectura para manejar las imágenes de la galería

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaterialData = async () => {
            try {
                const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
                const response = await fetch(
                    URL_BACKEND + `/api/materiales/${id}`
                );
                if (!response.ok) {
                    throw new Error("Error al cargar los datos del material");
                }

                const { data } = await response.json();
                setMaterialData(data);
            } catch (err) {
                setError("Error al cargar los datos del material");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterialData();
    }, [id]);

    useEffect(() => {
        const similares = [
            {
                id_material: 1,
                imagenUrl: material1,
                precio_material: "200",
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 2,
                imagenUrl: material2,
                precio_material: "200",
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 3,
                imagenUrl: material3,
                precio_material: "200",
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 4,
                imagenUrl: material4,
                precio_material: "200",
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 5,
                imagenUrl: material5,
                precio_material: "80",
                nombre_material: "Arena lavada",
            },
        ];

        setSimilares(similares);
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="font-nunito min-h-screen bg-gray-50">
            <Header />
            <div className=" mx-auto p-6">
                <p className="text-gray-600">Material ID: {id}</p>
                <h1 className="font-bold text-2xl text-gray-800 mt-4 mb-6">
                    Detalle de la Publicación
                </h1>

                <div className="lg:grid lg:grid-cols-2 gap-2">
                    <div className="">
                        <div className="space-y-6 bg-white rounded-lg shadow-lg p-8 ml-[5%]">
                            <div>
                                <label className="block font-semibold text-gray-700">
                                    Nombre del Material:
                                </label>
                                <p className="text-gray-800 text-lg">
                                    {materialData?.nombre_material}
                                </p>
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700">
                                    Precio:
                                </label>
                                <p className="text-gray-800 text-lg font-semibold">
                                    {materialData?.precio_material}
                                </p>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-gray-700">
                                        Tipo de material:
                                    </label>
                                    <p className="text-gray-800 text-lg">
                                        {materialData?.nombre_tipo_material}
                                    </p>
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700">
                                        Cantidad disponible:
                                    </label>
                                    <p className="text-gray-800 text-lg">
                                        {materialData?.cantidad_material}
                                    </p>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-gray-700">
                                        Medida:
                                    </label>
                                    <p className="text-gray-800 text-lg">
                                        {materialData?.tipo_unidad_material}
                                    </p>
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700">
                                        Condición:
                                    </label>
                                    <p className="text-gray-800 text-lg">
                                        {materialData?.estado_material}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700">
                                    Descripcion:
                                </label>
                                <p className="text-gray-800 text-lg">
                                    {materialData?.descripcion_material}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <label className="block font-semibold text-gray-700">
                                        Ubicación:
                                    </label>
                                    <p className="text-gray-800 text-lg">
                                        {materialData?.ubicacion_material}
                                    </p>
                                </div>
                                <div className="ml-2 p-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:cursor-pointer transition-colors duration-300">
                                    <MdLocationOn className="text-xl text-black" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4 bg-slate-50 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mt-4">
                            Galería
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {materialData?.imagenes &&
                                materialData.imagenes.map(
                                    ({ id_imagen, url_imagen }) => (
                                        <div
                                            key={id_imagen}
                                            className="w-full h-32 bg-gray-200 rounded-lg shadow-md"
                                        >
                                            <img
                                                src={url_imagen}
                                                alt={`Imagen`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                </div>

                <h1 className="font-bold text-2xl text-gray-800 mt-4 mb-6">
                    Publicaciones similares:
                </h1>
                <ListarMateriales materiales={similares} />
            </div>
        </div>
    );
};

export default Material;
