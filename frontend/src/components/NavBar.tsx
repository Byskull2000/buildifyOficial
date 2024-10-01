import buildifyLogo from "../assets/Buildify.png";
import { Link } from 'react-router-dom';

const navBar = () => {
    return (
        <div>
            <nav className="bg-white border-gray-200 font-nunito">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="#" className="flex items-center">
                        <img src={buildifyLogo} alt="Buildify Logo" className="h-14 mr-2" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap">Buildify</span>
                    </a>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                        <div className="relative mt-3 md:hidden">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="text" id="search-navbar" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 md:hover:text-blue-700" placeholder="Search..." />
                        </div>
                        <ul
                            className="font-nunito flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                            <Link
                                to="/login"
                                
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                            >
                                Register
                            </Link>
                        </ul>
                    </div>
                </div>
            </nav>
            <hr className="border-gray-300" />
        </div>
    );
}

export default navBar;
