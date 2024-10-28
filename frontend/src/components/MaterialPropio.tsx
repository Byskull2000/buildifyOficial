import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import imagenDefecto from '../assets/material_imagen_defecto.png';
import FormEliminacion from "../components/formEliminacion";

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
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="relative flex-shrink-0 transform transition-colors hover:bg-slate-50 bg-white shadow-lg rounded-2xl p-6 w-60 md:w-64 lg:w-72">
            <Link to={`/material/${material.id_material}`}>
                <img
                    className="w-full h-32 md:h-40 lg:h-48 object-cover rounded-lg"
                    src={material.imagenUrl || imagenDefecto}
                    alt={"imagen de " + material.nombre_material}
                />
                <p className="font-semibold mt-3 text-lg text-gray-800">Bs.{material.precio_material}</p>
                <p className="text-gray-700 text-sm">{material.nombre_material}</p>
            </Link>

            <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>

            {menuOpen && (
                <div className="absolute top-10 right-2 bg-white border border-gray-300 rounded shadow-lg py-1 w-28">
                    <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                            navigate(`/editarMaterial/${material.id_material}`);
                            setMenuOpen(false);
                        }}
                    >
                        Editar
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                            togglePopup();
                            setMenuOpen(false);
                        }}
                    >
                        Desactivar
                    </button>
                </div>
            )}

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                    <FormEliminacion />
                    <button
                        onClick={togglePopup}
                        className="absolute top-0 right-0 m-4 text-white bg-black p-2 rounded-full hover:bg-gray-800"
                    >
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
};

export default Material;
