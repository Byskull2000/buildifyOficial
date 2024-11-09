"use client";
import { useState } from "react";
import buildifyLogo from "../assets/Buildify.png";
import { Link, useNavigate } from "react-router-dom";
import imgProfile from "../assets/ejemploPerfil.jpg";
import logoMobile from "../assets/logo_mobile.png";

const NavBar = ({ buscar}: { buscar?: string }) => {
    const [search, setSearch] = useState(buscar || '');
    const [openSearch, setOpenSearch] = useState(false);
    const userStorage =
        sessionStorage.getItem("user") || localStorage.getItem("user") || null;
    const user = userStorage ? JSON.parse(userStorage) : null;
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(search);
        if (search.trim()) {
            navigate(`/buscar?query=${search}`);
        }
    };

    return (
        <div>
            <nav
                className={`bg-white border-gray-200 font-nunito flex justify-between w-full sm:px-4 py-4  ${
                    openSearch ? "w-full" : "w-auto"
                }`}
            >
                <div
                    className={`flex items-center gap-2 px-2 ${
                        openSearch ? "w-30" : ""
                    } `}
                >
                    <Link
                        to="/"
                        className={`flex items-center  ${
                            openSearch ? "sm:w-full" : ""
                        } `}
                    >
                        <img
                            src={buildifyLogo}
                            alt="Buildify Logo"
                            className={`h-14 w-14 mr-2 hidden sm:block`}
                        />
                        <h1
                            className={`
                        self-center text-2xl font-black  whitespace-nowrap hidden sm:block ${
                            openSearch ? "hidden" : ""
                        }
                        `}
                        >
                            Buildify
                        </h1>

                        <div className={`block sm:hidden w-12`}>
                            <img src={logoMobile} alt="logo" />
                        </div>
                    </Link>

                    <form onSubmit={handleSearch}>
                        <div
                            className={`flex justify-start ${
                                openSearch ? "w-full" : ""
                            }`}
                        >
                            <input
                                type="text"
                                id="search-navbar"
                                className={`${
                                    openSearch ? "flex" : "hidden"
                                } sm:block md:w-56 lg:w-80 py-2 pl-6 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500 `}
                                placeholder="Materiales, insumos"
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />
                            <button
                                type="submit"
                                className={`
                                  z-50 flex items-center rounded-full 
                                  ${!openSearch && "bg-gray-200 p-2 sm:p-0 "}
                                `}
                                onClick={() => setOpenSearch(!openSearch)}
                            >
                                <svg
                                    className={`w-4 h-4 -ml-9  text-gray-500 ${
                                        openSearch ? "" : "ml-0 sm:-ml-9"
                                    }`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
                <div
                    className={`${
                        openSearch ? "hidden" : ""
                    } flex p-0 md:pr-[5%]  lg:pr-[20%] gap-3 md:gap-6  items-center sm:flex `}
                >
                    <Link to={"/"} className="">
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13.4915 3.74788C13.9194 3.40461 14.4515 3.21753 15.0001 3.21753C15.5486 3.21753 16.0808 3.40461 16.5086 3.74788L24.8122 10.409C25.0938 10.6348 25.321 10.9211 25.4771 11.2465C25.6333 11.572 25.7143 11.9283 25.7143 12.2893V24.375C25.7143 25.0144 25.4604 25.6276 25.0083 26.0797C24.5562 26.5318 23.943 26.7857 23.3036 26.7857H20.6251C19.9857 26.7857 19.3725 26.5318 18.9204 26.0797C18.4683 25.6276 18.2143 25.0144 18.2143 24.375V17.4107C18.2143 17.1976 18.1297 16.9932 17.979 16.8425C17.8283 16.6918 17.6239 16.6072 17.4108 16.6072H12.5893C12.3762 16.6072 12.1718 16.6918 12.0211 16.8425C11.8704 16.9932 11.7858 17.1976 11.7858 17.4107V24.375C11.7858 25.0144 11.5318 25.6276 11.0797 26.0797C10.6276 26.5318 10.0144 26.7857 9.37505 26.7857H6.69648C6.05712 26.7857 5.44395 26.5318 4.99185 26.0797C4.53975 25.6276 4.28577 25.0144 4.28577 24.375V12.2893C4.28577 11.5575 4.61791 10.8665 5.18791 10.409L13.4915 3.74788Z"
                                fill="#FCA61E"
                            />
                        </svg>
                    </Link>
                    <Link to={"/"}>
                        <svg
                            width="22"
                            height="26"
                            viewBox="0 0 22 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19.0308 25.0613H2.80351C2.55449 25.063 2.31374 24.9601 2.12772 24.7723C1.94171 24.5845 1.82361 24.3252 1.79623 24.0444L1.00048 10.4992C0.996289 10.3479 1.01947 10.1972 1.0686 10.0564C1.11774 9.91561 1.19178 9.78774 1.28616 9.68068C1.38055 9.57362 1.49328 9.48963 1.61738 9.4339C1.74149 9.37816 1.87435 9.35187 2.00776 9.35663H19.9927C20.2599 9.35663 20.5161 9.477 20.705 9.69128C20.8939 9.90555 21 10.1962 21 10.4992L20.038 24.0559C20.0084 24.3345 19.8893 24.5911 19.7035 24.7765C19.5177 24.962 19.2782 25.0634 19.0308 25.0613V25.0613Z"
                                stroke="#707070"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M5.9613 13.0643V6.78008C5.9613 5.26493 6.49193 3.81183 7.43644 2.74046C8.38095 1.66909 9.66196 1.0672 10.9977 1.0672C12.3334 1.0672 13.6145 1.66909 14.559 2.74046C15.5035 3.81183 16.0341 5.26493 16.0341 6.78008V13.0643"
                                stroke="#707070"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </Link>
                    <Link to={"/"}>
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clip-path="url(#clip0_20_8)">
                                <path
                                    d="M15 29.442L29.2854 24L21.4104 21L29.2854 18L21.4104 15L29.2854 12L21.4104 8.99998L29.2854 5.99998L15 0.557983L0.7146 5.99998L8.5896 8.99998L0.7146 12L8.5896 15L0.7146 18L8.5896 21L0.7146 24L15 29.442ZM4.0854 5.99998L15 1.84198L25.9146 5.99998L19.725 8.35798L15 10.158L10.275 8.35798L4.0854 5.99998ZM4.0854 12L10.275 9.64198L15 11.442L19.725 9.64198L25.9146 12L19.725 14.358L15 16.158L10.275 14.358L4.0854 12ZM4.0854 18L10.275 15.642L15 17.442L19.725 15.642L25.9146 18L19.725 20.358L15 22.158L10.275 20.358L4.0854 18ZM19.725 21.642L25.9146 24L15 28.158L4.0854 24L10.275 21.642L15 23.442L19.725 21.642Z"
                                    fill="#707070"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_20_8">
                                    <rect width="30" height="30" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </Link>
                </div>
                <div
                    className={`flex  justify-end gap-3 md:gap-8  px-2 items-center ${
                        openSearch ? " sm:flex" : ""
                    }`}
                >
                    {user ? (
                        <>
                            <button>
                                <svg
                                    width="23"
                                    height="23"
                                    viewBox="0 0 28 23  "
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex items-center"
                                >
                                    <path
                                        d="M22 0.988281H1V18.8436H8.84099L17.0221 23.8398L16.0327 18.8436H22V0.988281Z"
                                        stroke="#707070"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                            <button>
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M23.8066 20.1462C23.7159 20.0368 23.6267 19.9274 23.5392 19.8219C22.3361 18.3666 21.6082 17.4884 21.6082 13.3687C21.6082 11.2359 21.098 9.48593 20.0923 8.17343C19.3507 7.20382 18.3483 6.46827 17.027 5.92468C17.01 5.91522 16.9948 5.90282 16.9822 5.88804C16.507 4.29663 15.2065 3.23077 13.7398 3.23077C12.273 3.23077 10.9731 4.29663 10.4979 5.8864C10.4852 5.90063 10.4702 5.91265 10.4536 5.92195C7.37031 7.19124 5.87188 9.62648 5.87188 13.3671C5.87188 17.4884 5.14508 18.3666 3.94086 19.8202C3.85336 19.9258 3.76422 20.033 3.67344 20.1445C3.43894 20.4273 3.29036 20.7714 3.2453 21.136C3.20023 21.5006 3.26056 21.8705 3.41914 22.2019C3.75656 22.9128 4.4757 23.3541 5.29656 23.3541H22.189C23.006 23.3541 23.7202 22.9134 24.0588 22.2057C24.218 21.8742 24.2789 21.504 24.2342 21.139C24.1896 20.774 24.0412 20.4294 23.8066 20.1462ZM13.7398 27.7308C14.53 27.7301 15.3054 27.5156 15.9836 27.11C16.6618 26.7044 17.2176 26.1227 17.592 25.4268C17.6096 25.3934 17.6183 25.3561 17.6172 25.3184C17.6162 25.2807 17.6054 25.2439 17.5859 25.2116C17.5664 25.1792 17.5389 25.1525 17.506 25.134C17.4732 25.1155 17.4361 25.1057 17.3984 25.1058H10.0823C10.0445 25.1056 10.0073 25.1153 9.97439 25.1338C9.94145 25.1523 9.91387 25.179 9.89432 25.2113C9.87477 25.2436 9.86392 25.2805 9.86284 25.3182C9.86175 25.356 9.87047 25.3934 9.88813 25.4268C10.2625 26.1226 10.8182 26.7042 11.4963 27.1098C12.1744 27.5155 12.9496 27.73 13.7398 27.7308Z"
                                        fill="#707070"
                                    />
                                </svg>
                            </button>

                            <Link to={"/profile"} className="w-10">
                                <img
                                    src={user.imagen_perfil || imgProfile}
                                    alt="imagen de perfil"
                                    className="h-10 w-10 rounded-full"
                                />
                            </Link>
                        </>
                    ) : (
                        <ul className="font-nunito flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </ul>
                    )}
                </div>
            </nav>
            <hr className="border-gray-300" />
        </div>
    );
};

export default NavBar;
