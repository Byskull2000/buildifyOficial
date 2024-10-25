import React, { useRef } from "react";
import Material, { type MaterialProp } from "./Material";

interface ListarMaterialesProps {
    materiales: MaterialProp[];
}

const ListarMateriales = ({ materiales }: ListarMaterialesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            const container = containerRef.current;

            e.preventDefault();

            container.scrollLeft -= e.deltaY;
        }
    };

    const handleMouseEnter = () => {
        document.body.style.overflow = 'hidden'; 
    };
    const handleMouseLeave = () => {
        document.body.style.overflow = ''; 

    };

    return (
        <div
            ref={containerRef}
            className="flex gap-2 md:gap-9 md:px-4 py-5 overflow-x-auto hide-scrollbar"
            onWheel={handleScroll} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {materiales.map((material, index) => (
                <Material key={index} material={material} />
            ))}
        </div>
    );
};

export default ListarMateriales;
