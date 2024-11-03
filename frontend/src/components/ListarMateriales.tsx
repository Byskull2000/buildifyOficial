import { useRef } from "react";
import Material, { type MaterialProp } from "./Material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface ListarMaterialesProps {
    materiales: MaterialProp[];
}

const ListarMateriales = ({ materiales }: ListarMaterialesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative">
            <button
                className="hidden sm:absolute sm:block bg-yellow-500 rounded-full left-0 hover:bg-yellow-400 hover:rounded-full text-gray-800 -translate-y-1/2 z-50  top-1/2 items-center justify-center w-10 h-10 bg-transparent focus:outline-none  "
                onClick={() => {
                    if (containerRef.current) {
                        const container = containerRef.current;
                        container.scrollBy({ left: -300, behavior: "smooth" });
                    }
                }}
            >
                <FontAwesomeIcon
                    icon={faChevronLeft}
                />
            </button>
            <div
                ref={containerRef}
                className="flex gap-2 md:gap-9 py-5 px-2 overflow-x-auto hide-scrollbar transition-all"
            >
                {materiales.map((material, index) => (
                    <Material key={index} material={material} />
                ))}
            </div>
            <button
                className="hidden sm:block sm:absolute bg-yellow-500 rounded-full right-0  hover:bg-yellow-400 hover:rounded-full text-gray-800  top-1/2 -translate-y-1/2 z-50  items-center justify-center w-10 h-10 bg-transparent focus:outline-none"
                onClick={() => {
                    if (containerRef.current) {
                        const container = containerRef.current;
                        container.scrollBy({ left: 300, behavior: "smooth" });
                    }
                }}
            >
                <FontAwesomeIcon
                    icon={faChevronRight}
                   
                />
            </button>
        </div>
    );
};

export default ListarMateriales;
