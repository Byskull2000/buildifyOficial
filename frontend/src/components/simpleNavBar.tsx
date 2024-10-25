"use client";
import buildifyLogo from "../assets/Buildify.png";
import { Link} from "react-router-dom";
import logoMobile from "../assets/logo_mobile.png";

const NavBar = ({ children }: { children?: React.ReactNode })=> {
    return (
        <div>
            {children}
            <nav
                className={`bg-white border-gray-200 font-nunito flex justify-between w-full sm:px-4 py-4`}
            >
                <div
                    className={`flex items-center gap-2 px-2  `}
                >
                    <Link
                        to="/"
                        className={`flex items-center`}
                    >
                        <img
                            src={buildifyLogo}
                            alt="Buildify Logo"
                            className={`h-14 w-14 mr-2 hidden sm:block`}
                        />
                        <h1
                            className={`
                        self-center text-2xl font-black  whitespace-nowrap hidden sm:block
                                }
                        `}
                        >
                            Buildify
                        </h1>

                        <div className={`block sm:hidden w-12`}>
                            <img src={logoMobile} alt="logo" />
                        </div>
                    </Link>
                </div>
            </nav>
            <hr className="border-gray-300" />
        </div>
    );
};

export default NavBar;
