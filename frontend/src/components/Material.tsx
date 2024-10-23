import { Link } from "react-router-dom";

export interface MaterialProp {
    id: number;
    titulo: string;
    imagenUrl: string;
    precio: number;
}
export interface MaterialProps {
    material: MaterialProp;
}

const Material = ({ material }: MaterialProps) => {
    return (
        <Link
            to={"/materiales/" + material.id}
            className="flex-shrink-0 hover:scale-110 transform transition"
        >
            <img
                className="w-40 h-28 md:w-52 md:h-52 object-cover rounded-xl md:rounded-2xl"
                src={material.imagenUrl}
                alt={"imagen de " + material.titulo}
            />
            <p className="font-semibold ">Bs.{material.precio}</p>
            <p className="">{material.titulo}</p>
        </Link>
    );
};

export default Material;
