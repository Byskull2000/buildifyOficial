import { Link } from "react-router-dom";
import imagenDefecto from '../assets/material_imagen_defecto.png'

export interface MaterialProp {
    id_material: number;
    nombre_material: string;
    imagenUrl?: string;
    precio_material: number;
    tipo_unidad_material?: string;
    estado_material?: string;
}
export interface MaterialProps {
    material: MaterialProp;
}

const Material = ({ material }: MaterialProps) => {
    return (
        <Link
            to={"/material/" + material.id_material}
            className="relative flex-shrink-0 transform transition-colors hover:bg-slate-50 bg-white shadow-lg rounded-2xl p-6 w-60 md:w-64 lg:w-72"
        >
            <img
                className=" w-full h-36  md:h-52 object-cover rounded-xl md:rounded-2xl"
                src={material.imagenUrl|| imagenDefecto}
                alt={"imagen de " + material.nombre_material}
            />
            <p className="font-semibold ">Bs.{material.precio_material}</p>
            <p className="font-semibold"></p>
            <p className="">{material.nombre_material}</p>
            <p className="font-semibold text-orange-600">Estado: {material.estado_material}</p>
            <p className="font-semibold text-blue-600">Medida: {material.tipo_unidad_material}</p>
        </Link>
    );
};

export default Material;
