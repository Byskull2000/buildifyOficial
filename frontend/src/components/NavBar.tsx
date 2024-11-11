"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBookmark } from "@fortawesome/free-solid-svg-icons";
import buildifyLogo from "../assets/Buildify.png";
import imgProfile from "../assets/ejemploPerfil.jpg";
import logoMobile from "../assets/logo_mobile.png";

const NavBar = ({ buscar }: { buscar?: string }) => {
  const [search, setSearch] = useState(buscar || "");
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
        className={`bg-white border-gray-200 font-nunito flex justify-between items-center w-full sm:px-4 py-4`}
      >
        <div className="flex items-center gap-2 px-2">
          <Link to="/" className="flex items-center">
            <img
              src={buildifyLogo}
              alt="Buildify Logo"
              className="h-14 w-14 mr-2 hidden sm:block"
            />
            <h1 className="self-center text-2xl font-black whitespace-nowrap hidden sm:block">
              Buildify
            </h1>
            <div className="block sm:hidden w-12">
              <img src={logoMobile} alt="logo" />
            </div>
          </Link>
          <form onSubmit={handleSearch}>
            <div className="flex items-center justify-start gap-2">
              <input
                type="text"
                id="search-navbar"
                className="hidden sm:block md:w-56 lg:w-80 py-2 pl-6 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Materiales, insumos"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <button
                type="submit"
                className="z-50 flex items-center rounded-full bg-gray-200 p-2 sm:p-0"
                onClick={() => setOpenSearch(!openSearch)}
              >
                <svg
                  className="w-4 h-4 -ml-9 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>

              {/* Botón de inicio, lo que tiene forma de casita xd*/}
              <Link to="/" className="text-gray-600 hover:text-blue-500">
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
            </div>
          </form>
        </div>

        <div className="flex items-center ml-auto gap-4 pr-4">
          {user ? (
            <>
              {/* Icono del carrito */}
              <Link to="/carrito" className="text-gray-600 hover:text-blue-500">
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              </Link>

              {/* Icono de guardados */}
              <Link
                to="/guardados"
                className="text-gray-600 hover:text-blue-500"
              >
                <FontAwesomeIcon icon={faBookmark} size="lg" />
              </Link>

              {/* Icono de perfil */}
              <Link to="/profile">
                <img
                  src={user.imagen_perfil || imgProfile}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </Link>
            </>
          ) : (
            <ul className="font-nunito flex gap-4">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-blue-500">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-blue-500"
                >
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <hr className="border-gray-300" /> {/* Línea de separación */}
    </div>
  );
};

export default NavBar;
