import ObraFina from "../assets/Bote pintura.png";
import Electrico from "../assets/Electrico.png";
import Herramientas from "../assets/Herramientas.png";
import Carpinteria from "../assets/Carpinteria.png";
import Plomeria from "../assets/Plomeria.png";
import Ladrillo from "../assets/Ladrillo.png";
import Luz from "../assets/luz.png";
import Cemento from "../assets/Cemento.png";
import { Link } from "react-router-dom";

const Page = () => {
    return (
        <div className="flex overflow-x-auto hide-scrollbar py-5 gap-4">
            {/* Ajustar links por filtrado o la invocación a la página o componente en el link */}
            <Link to="/">
                <div className="w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={ObraFina} />
                        <span className="text-sm">Obra fina</span>
                    </div>
                </div>
            </Link>
            <Link to="/">
                <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Electrico} />
                        <span className="text-sm">Electricidad</span>
                    </div>
                </div>
            </Link>
            <Link to="/">
                <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Herramientas} />
                        <span className="text-sm">Herramientas</span>
                    </div>
                </div>
            </Link>
            <Link to="/">
                <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Plomeria} />
                        <span className="text-sm">Plomeria</span>
                    </div>
                </div>
            </Link>
            <Link to="/">
                <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Ladrillo} />
                        <span className="text-sm">Obra Gruesa</span>
                    </div>
                </div>
            </Link>
            <Link to="/">
                <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Carpinteria} />
                        <span className="text-sm">Carpinteria</span>
                    </div>
                </div>
            </Link>
            <Link to="/">
                <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Cemento} />
                        <span className="text-sm">Cemento</span>
                    </div>
                </div>
            </Link>
            <Link to="/">
                <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Luz} />
                        <span className="text-sm">Iluminación</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Page;
