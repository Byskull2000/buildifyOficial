import Herramientas from "../assets/Herramientas.png";
import Madera from "../assets/Madera.png";
import Ladrillo from "../assets/Ladrillo.png";
import Cemento from "../assets/Cemento.png";
import Tablones from "../assets/Tablones.png";
import Vigas from "../assets/Vigas.png";
import Arena from "../assets/Arena.png";
import Mezclas from "../assets/Mezclas.png";
import Tejas from "../assets/Tejas.png";
import Piedras from "../assets/Piedras.png";
import Yeso from "../assets/Yeso.png";
import buildifyLogo from "../assets/Buildify.png";

import { Link, useLocation } from "react-router-dom";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const categoriasData = [
  { id: 1, name: "Ladrillo", imgSrc: Ladrillo },
  { id: 2, name: "Cemento", imgSrc: Cemento },
  { id: 3, name: "Tablones", imgSrc: Tablones },
  { id: 4, name: "Vigas", imgSrc: Vigas },
  { id: 5, name: "Arena", imgSrc: Arena },
  { id: 6, name: "Mezclas", imgSrc: Mezclas },
  { id: 7, name: "Herramientas", imgSrc: Herramientas },
  { id: 8, name: "Madera", imgSrc: Madera },
  { id: 9, name: "Tejas", imgSrc: Tejas },
  { id: 10, name: "Yeso", imgSrc: Yeso },
  { id: 11, name: "Piedras", imgSrc: Piedras },
];

const Categorias = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentTypeId = new URLSearchParams(location.search).get("id");

  const isInicio = location.pathname === "/";

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft -= 150;
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft += 150;
  };

  return (
    <div>
      <div className="relative w-full">
        {/* Título elegante de la sección de categorías, solo en la página de navegación */}
        {!isInicio && (
          <div>
            <div className="bg-white border-gray-200 font-nunito flex justify-between w-full sm:px-4 py-4">
              <Link to="/">
                <div className="flex items-center gap-2 px-2">
                  <Link to="/">
                    <img
                      src={buildifyLogo}
                      alt="Logo de buildifyF"
                      className={`h-14 w-14 mr-2 hidden sm:block`}
                    />
                  </Link>
                  <h1 className="self-center text-2xl font-black  whitespace-nowrap hidden sm:block">
                    Buildify
                  </h1>
                </div>
              </Link>
            </div>
            <div className="text-center text-xl font-semibold mb-4 p-2 bg-[#FDBC3F] text-white rounded-md shadow-md">
              Explore nuestra selección de materiales por categoría
            </div>
          </div>

        )}

        {/* Contenedor para las flechas y la barra de categorías */}
        <div className="flex items-center justify-center w-full">
          <button
            className="hidden md:flex bg-[#e3961b] text-black rounded-full w-10 h-10 items-center justify-center shadow-lg focus:outline-none mr-2"
            onClick={scrollLeft}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div
            className="flex overflow-x-auto hide-scrollbar py-5 gap-4 w-full max-w-7xl"
            ref={scrollRef}
          >
            {categoriasData.map((categoria) => (
              <Link to={`/materiales?id=${categoria.id}`} key={categoria.id}>
                <div
                  className={`w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors ${!isInicio && currentTypeId !== String(categoria.id)
                    ? "opacity-60"
                    : "opacity-100"
                    }`}
                >
                  <div className="flex flex-col items-center pb-10 mt-4">
                    <img
                      className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg"
                      src={categoria.imgSrc}
                      alt={categoria.name}
                    />
                    <span className="text-sm">{categoria.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button
            className="hidden md:flex bg-[#e3961b] text-black rounded-full w-10 h-10 items-center justify-center shadow-lg focus:outline-none ml-2"
            onClick={scrollRight}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categorias;
