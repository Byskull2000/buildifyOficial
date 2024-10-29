import NavBar from "../components/simpleNavBar";
import Material, { MaterialProp } from "../components/MaterialPropio";

const propios = () => {
    // Ejemplo de datos de materiales
    const materiales: MaterialProp[] = [
        { id_material: 1, nombre_material: "Cemento", precio_material: 30 },
        { id_material: 2, nombre_material: "Ladrillo", precio_material: 15 },
        { id_material: 3, nombre_material: "Arena", precio_material: 20 },
        { id_material: 4, nombre_material: "Hierro", precio_material: 50 },
        { id_material: 5, nombre_material: "Cal", precio_material: 10 },
        { id_material: 6, nombre_material: "Pintura", precio_material: 25 },
        // Filtrar estos materiales desde el BACKEND
    ];
    return (
        <div className="font-nunito">
            <NavBar />
            <h1 className="font-bold text-2xl text-gray-800 mt-4 mb-6 ml-[2%]">Todas tus publicaciones:</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 lg:px-8 justify-items-center">
                {materiales.map((material) => (
                    <Material key={material.id_material} material={material} />
                ))}
            </div>
        </div>
    );

};

export default propios;
