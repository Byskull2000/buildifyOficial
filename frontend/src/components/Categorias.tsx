import Herramientas from "../assets/Herramientas.png";
import Carpinteria from "../assets/Carpinteria.png";
import Ladrillo from "../assets/Ladrillo.png";
import Cemento from "../assets/Cemento.png";
import Tablones from "../assets/Tablones.png"
import Vigas from "../assets/Vigas.png"
import Arena from "../assets/Arena.png"
import Mezclas from "../assets/Mezclas.png"
import Tejas from "../assets/Tejas.png"
import Piedras from "../assets/Piedras.png"
import Yeso from "../assets/Yeso.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";

const Page = () => {
    return (
        <div className="relative py-5">
            <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-10 h-10 bg-transparent focus:outline-none"
                onClick={() => {
                    const scrollable = document.querySelector('.overflow-x-auto');
                    scrollable?.scrollBy({ left: -500, behavior: 'smooth' });
                }}
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-gray-700" />
            </button>

            <div className="flex overflow-x-auto hide-scrollbar py-5 gap-4">
                <Link to="/">
                    <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Ladrillo} />
                            <span className="text-sm">Ladrillos</span>
                        </div>
                    </div>
                </Link>
                <Link to="/">
                    <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Carpinteria} />
                            <span className="text-sm">Madera</span>
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
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Herramientas} />
                            <span className="text-sm">Herramientas</span>
                        </div>
                    </div>
                </Link>
                <Link to="/">
                    <div className="w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Tablones} />
                            <span className="text-sm">Tablones</span>
                        </div>
                    </div>
                </Link>
                <Link to="/">
                    <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Vigas} />
                            <span className="text-sm">Vigas</span>
                        </div>
                    </div>
                </Link>
                <Link to="/">
                    <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Arena} />
                            <span className="text-sm">Arena</span>
                        </div>
                    </div>
                </Link>
                <Link to="/">
                    <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Mezclas} />
                            <span className="text-sm">Mezclas</span>
                        </div>
                    </div>
                </Link>
                <Link to="/">
                    <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Tejas} />
                            <span className="text-sm">Tejas</span>
                        </div>
                    </div>
                </Link>
                <Link to="/">
                    <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Yeso} />
                            <span className="text-sm">Yeso</span>
                        </div>
                    </div>
                </Link>
                <Link to="/">
                    <div className="w-24 sm:w-24 md:w-28 xl:w-48 bg-[#FDBC3F] border border-gray-200 rounded-lg shadow hover:bg-[#f7a914] transition-colors">
                        <div className="flex flex-col items-center pb-10 mt-4">
                            <img className="w-16 sm:w-16 md:w-16 xl:w-28 h-auto mb-3 rounded-full shadow-lg" src={Piedras} />
                            <span className="text-sm">Piedras</span>
                        </div>
                    </div>
                </Link>
            </div>
            <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-10 h-10 bg-transparent focus:outline-none"
                onClick={() => {
                    const scrollable = document.querySelector('.overflow-x-auto');
                    scrollable?.scrollBy({ left: 500, behavior: 'smooth' });
                }}
            >
                <FontAwesomeIcon icon={faChevronRight} className="text-gray-700" />
            </button>
        </div>

    );
};

export default Page;
