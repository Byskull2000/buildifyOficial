"use client";
import { useState } from "react";
import { useEffect } from "react";
import fondologin from "../assets/fondoRegisterF.jpg";
import logo from "../assets/Buildify.png";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import PasswordStrengthBar from "react-password-strength-bar";


const Page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [passwordS, setPasswordS] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [hasNumber, setHasNumber] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [passwordScore, setPasswordScore] = useState(0);
    const [telefonoValido, setTelefonoValido] = useState(false);
    const [cod_pais, setCodPais] = useState("+591")
    const scoreWords = [
        "Muy débil",
        "Débil",
        "Aceptable",
        "Fuerte",
        "Muy fuerte",
    ];
    const [emailValido, setEmailValido] = useState(true); // Estado para almacenar si el correo es válido o no

    // Función de validación de correo
    const validarEmail = (valor: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(valor)) {
            setEmailValido(true);
        } else {
            setEmailValido(false);
        }
    };

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
        };

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passwordS !== password) {
            setError("Las contraseñas no son iguales");
            return;
        }
        if (!validatePassword(password)) {

            setError(
                "La contraseña debe contener al menos una letra mayúscula y un número"
            );
            return;
        }
        if (passwordScore < 3) {
            setError("Por favor, elige una contraseña más fuerte.");
            return;
        }

        const body = {
            nombre_usuario: nombre,
            correo_electronico: email,
            contrasenia: password,
            numero_telefono: cod_pais + " " + telefono,
        };

        try {
            setLoading(true);
            const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
            const res = await fetch(URL_BACKEND + "/api/RegistrarUsuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorResponse = await res.json();
                setError(errorResponse.message || "Error al registrar usuario");
                setLoading(false);
                return;
            }

            const { data } = await res.json();
            if (!data || data !== undefined) {
                console.log("data: ", data);
                localStorage.setItem("user", JSON.stringify(data));
                navigate("/");
            }
        } catch (e) {
            console.error(e);
            setError("Error en la conexión con el servidor");
            setLoading(false);
        }
    };
    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        const numberRegex = /\d/;
        setHasNumber(numberRegex.test(newPassword));
    };

    const handlePasswordVerifyChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const confirmPassword = event.target.value;
        setPasswordS(confirmPassword);

        if (confirmPassword === password) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    };

    const validatePassword = (password: string) => {
        const upperCaseCheck = /[A-Z]/.test(password);
        const numberCheck = /\d/.test(password);
        const lengthCheck = password.length >= 8;
        setHasNumber(numberCheck);
        return upperCaseCheck && numberCheck && lengthCheck;
    };

    return (
        <div>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
            {loading ? (
                <Loading />
            ) : (
                <div className="flex font-poppins">
                    <div className="hidden lg:flex items-center justify-center flex-1 relative bg-white text-black w-2/3 min-h-screen">
                        <img
                            src={fondologin}
                            alt="ImagenDelLogin"
                            className="absolute inset-0 h-full w-full object-cover "
                        />
                    </div>
                    <div className="w-full bg-white lg:w-1/3 flex items-center justify-center flex-col min-h-screen ">
                        <div className="w-4/5">
                            <Link to="/" className="">
                                <div className="flex items-center mb-7">
                                    <img
                                        src={logo}
                                        alt="Buildify Logo"
                                        width={50}
                                        height={50}
                                        className="mr-2"
                                    />
                                    <h1 className="text-3xl font-semibold text-black">
                                        Buildify
                                    </h1>
                                </div>
                            </Link>
                            <form
                                onSubmit={handleSubmit}
                                method="POST"
                                className="space-y-4"
                            >
                                <h1 className="text-2xl font-medium mb-6 text-black text-left w-full">
                                    Regístrate ahora
                                </h1>
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-500 ml-2"
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        value={nombre}
                                        onChange={(e) =>
                                            setNombre(e.target.value)
                                        }
                                        placeholder="Nombre completo"
                                        type="text"
                                        id="name"
                                        name="name"
                                        pattern="[A-Za-z\s]+"
                                        maxLength={50}
                                        className="bg-gray-100 mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-500 ml-2"
                                    >
                                        Número de celular
                                    </label>
                                    <div className="flex space-x-2">
                                        <select
                                            defaultValue={cod_pais}
                                            className="bg-gray-100 mt-1 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                            onChange={e => setCodPais(e.target.value)}
                                        >
                                            <option value="+591">+591</option>
                                            <option value="+31">+31</option>
                                        </select>
                                        <input
                                            value={telefono}
                                            onChange={(e) => {
                                                const valor = e.target.value.replace(/[^+\d-]/g, ""); // Permite solo +, dígitos, y guiones
                                                // Contar solo los dígitos, excluyendo '+' y '-'
                                                const cantidadDigitos = valor.replace(/\D/g, "").length;

                                                if (cantidadDigitos <= 8) {
                                                    setTelefono(valor);
                                                }

                                                // Validar si el teléfono tiene exactamente 8 dígitos
                                                if (cantidadDigitos >= 7) {
                                                    setTelefonoValido(true);
                                                } else {
                                                    setTelefonoValido(false);
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                // Evitar ingreso de las teclas 'e', '-', y '+' directamente
                                                if (["e", "-", "+"].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            placeholder="Número de teléfono"
                                            type="tel" // Cambiado a 'tel' en lugar de 'number' para un mejor control de entrada de números de teléfono
                                            id="phone"
                                            name="phone"
                                            className="bg-gray-100 mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                        />

                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-500 ml-2"
                                    >
                                        Correo electrónico
                                    </label>
                                    <input
                                        value={email}
                                        onChange={(e) => {
                                            const valor = e.target.value;
                                            setEmail(valor);
                                            validarEmail(valor); // Llamamos a la función de validación
                                        }}
                                        placeholder="Correo electrónico"
                                        type="email" // Cambiado a 'email' para manejo adecuado del input
                                        id="email"
                                        name="email"
                                        className={`bg-gray-100 mt-1 p-2 w-full border rounded-md transition-colors duration-300 focus:outline-none ${emailValido ? "focus:ring-2 focus:ring-gray-300 focus:border-gray-200" : "focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                            }`}
                                    />
                                    {/* Mensaje de error si el correo es inválido */}
                                    {!emailValido && email && (
                                        <span className="text-yellow-500 text-sm mt-1 block">Correo no válido</span>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-500 ml-2"
                                    >
                                        Contraseña
                                    </label>
                                    <div>
                                        <div className="relative">
                                            <input
                                                value={password}
                                                placeholder="Ingresa tu contraseña"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="password"
                                                name="password"
                                                className="bg-gray-100 mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                                required
                                                onChange={handlePasswordChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
                                            >
                                                {showPassword ? (
                                                    <svg
                                                        className="mt-1 w-5 h-5 mr-1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 576 512"
                                                    >
                                                        <path
                                                            fill="#9e9e9e"
                                                            d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className="mt-1 w-5 h-5 mr-1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 640 512"
                                                    >
                                                        <path
                                                            fill="#9e9e9e"
                                                            d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {password && (
                                            <PasswordStrengthBar
                                                password={password}
                                                scoreWords={scoreWords}
                                                onChangeScore={(score) =>
                                                    setPasswordScore(score)
                                                }
                                                shortScoreWord="Demasiado corta"
                                                className="-mb-5"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-500 ml-2"
                                    >
                                        Repite tu contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            value={passwordS}
                                            placeholder="Ingresa tu contraseña"
                                            type={
                                                showPassword2
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="password"
                                            name="password"
                                            className="bg-gray-100 mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                            required
                                            onChange={
                                                handlePasswordVerifyChange
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword2(!showPassword2)
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
                                        >
                                            {showPassword2 ? (
                                                <svg
                                                    className="mt-1 w-5 h-5 mr-1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 576 512"
                                                >
                                                    <path
                                                        fill="#9e9e9e"
                                                        d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="mt-1 w-5 h-5 mr-1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 640 512"
                                                >
                                                    <path
                                                        fill="#9e9e9e"
                                                        d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {hasNumber && passwordS && (
                                        <p
                                            className={`text-sm mt-1 ${passwordsMatch
                                                ? "text-green-500"
                                                : "text-red-500"
                                                }`}
                                        >
                                            {passwordsMatch
                                                ? "✓ Las contraseñas coinciden"
                                                : "✗ Las contraseñas no coinciden"}
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <p style={{ color: "red" }}>{error}</p>
                                )}
                                <div>
                                    <button
                                        type="submit"
                                        className={`mb-2 py-2 w-full bg-blue-600 text-white p-2 font-normal rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 ${!nombre ||
                                            !emailValido ||
                                            !telefonoValido ||
                                            !telefono ||
                                            !email ||
                                            passwordScore < 3 ||
                                            password !== passwordS
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                            }`}
                                        disabled={
                                            !emailValido ||
                                            !telefonoValido ||
                                            !nombre ||
                                            !telefono ||
                                            !email ||
                                            passwordScore < 3 ||
                                            password !== passwordS
                                        }
                                    >
                                        Registrarme
                                    </button>
                                </div>
                                <hr className="border-gray-200" />
                                <div className="w-full mb-2 lg:mb-0 mt-5 ">
                                    <button
                                        type="button"
                                        className="py-3 w-full grid justify-items-center gap-2 bg-stone-800 text-sm text-gray-100 p-2 rounded-lg hover:bg-stone-950 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-950 transition-colors duration-300"
                                    >
                                        <div className="flex gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                                className="w-4"
                                                id="google"
                                            >
                                                <path
                                                    fill="#fbbb00"
                                                    d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                                                ></path>
                                                <path
                                                    fill="#518ef8"
                                                    d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                                                ></path>
                                                <path
                                                    fill="#28b446"
                                                    d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                                                ></path>
                                                <path
                                                    fill="#f14336"
                                                    d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                                                ></path>
                                            </svg>
                                            Continuar con Google
                                        </div>
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 text-sm text-center ">
                                <p className="text-gray-600">
                                    Ya tienes una cuenta?
                                    <Link
                                        to="/login"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Page;
