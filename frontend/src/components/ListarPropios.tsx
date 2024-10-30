import { useRef } from "react";
import Material, { MaterialProp } from "./MaterialPropio";
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
        className="md:absolute left-0 hover:bg-yellow-400 hover:rounded-full text-gray-800 -translate-y-1/2 z-50 top-1/2 items-center justify-center w-10 h-10 bg-transparent focus:outline-none"
        onClick={() => {
          if (containerRef.current) {
            containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
          }
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div
        ref={containerRef}
        className="flex gap-4 py-5 px-2 overflow-x-auto hide-scrollbar"
      >
        {materiales.map((material, index) => (
          <Material key={index} material={material} />
        ))}
      </div>
      <button
        className="md:absolute right-0 hover:bg-yellow-400 hover:rounded-full text-gray-800 top-1/2 -translate-y-1/2 z-50 items-center justify-center w-10 h-10 bg-transparent focus:outline-none"
        onClick={() => {
          if (containerRef.current) {
            containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default ListarMateriales;
