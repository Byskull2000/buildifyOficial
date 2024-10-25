import { Link } from "react-router-dom";
import imagenDefecto from '../assets/material_imagen_defecto.png'

export interface MaterialProp {
    id_material: number;
    nombre_material: string;
    imagenUrl?: string;
    precio_material: number;
}
export interface MaterialProps {
    material: MaterialProp;
}

const Material = ({ material }: MaterialProps) => {
    return (
        <Link
            to={"/materiales/" + material.id_material}
            className="flex-shrink-0 hover:scale-105 transform transition"
        >
            <img
                className="w-36 h-24 md:w-52 md:h-52 object-cover rounded-xl md:rounded-2xl"
                src={material.imagenUrl|| imagenDefecto}
                alt={"imagen de " + material.nombre_material}
            />
            <p className="font-semibold ">Bs.{material.precio_material}</p>
            <p className="">{material.nombre_material}</p>
        </Link>
    );
};

export default Material;
