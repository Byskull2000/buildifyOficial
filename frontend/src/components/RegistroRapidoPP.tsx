import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/Buildify.png"
const Page = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordS, setPasswordS] = useState('');
    const [showPassword2, setShowPassword2] = useState(false);
    const [hasUpperCase, setHasUpperCase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [error, setError] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordLength, setPasswordLength] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passwordS !== password) {
            console.error('Las contraseñas no son iguales');
            return;
        }
        if (!validatePassword(password)) {
            console.error('La contraseña debe contener al menos una letra mayúscula y un número');
            return;
        }

        const body = {
            "nombre_usuario": nombre,
            "correo_electronico": email,
            "contrasenia": password,
            "fecha_creacion": Date.now + "",
        };


        try {
            const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
            const res = await fetch(URL_BACKEND + "/api/RegistrarUsuario", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorResponse = await res.json();
                setError(errorResponse.message || "Error al registrar usuario");
                return;
            }

            const { data } = await res.json();
            console.log("data: ", data);

        } catch (e) {
            console.error(e);
            setError("Error en la conexión con el servidor");
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);


        const upperCaseRegex = /[A-Z]/;
        setHasUpperCase(upperCaseRegex.test(newPassword));


        const numberRegex = /\d/;
        setHasNumber(numberRegex.test(newPassword));


        setPasswordLength(newPassword.length >= 8);
    };

    const handlePasswordVerifyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setHasUpperCase(upperCaseCheck);
        setHasNumber(numberCheck);
        setPasswordLength(lengthCheck);
        return upperCaseCheck && numberCheck && lengthCheck;
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Abrir formulario
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white py-10 px-24 rounded-xl shadow-lg">
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(false)}
                                className=" mr-[-60px] mt-[-20px] absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800 transition-colors duration-300 text-4xl"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex items-center lg:ml-[-16px] lg:mb-16 mt-10">
                            <img src={logo} alt="Buildify Logo" width={50} height={50} className="mr-2" />
                            <h1 className="text-3xl font-bold text-black">Buildify</h1>
                        </div>
                        <h1 className="lg:mt-[-50px] text-2xl font-semibold mb-6 text-black text-left w-full lg:ml-[-10px]">Registro rápido</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-500 ml-2 w-full">Nombre</label>
                                <input
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    placeholder="Nombre completo"
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="bg-gray-100 mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-500 ml-2">Inicio de sesión</label>
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Correo electrónico"
                                    type="text"
                                    id="email"
                                    name="email"
                                    className="bg-gray-100 mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-500 ml-2">Contraseña</label>
                                <div className="relative">
                                    <input
                                        value={password}
                                        placeholder="Ingresa tu contraseña"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="bg-gray-100 mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                        required
                                        onChange={handlePasswordChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
                                    >
                                        {showPassword ? (
                                            <svg className="mt-1 w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                <path fill="#9e9e9e" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                                            </svg>
                                        ) : (
                                            <svg className="mt-1 w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" >
                                                <path fill="#9e9e9e" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.1-2.2 19.7-5.7 28.5L223.1 149.5zM288 240c-35.3 0-64 28.7-64 64c0 35.3 28.7 64 64 64s64-28.7 64-64s-28.7-64-64-64z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className={`text-sm ${hasUpperCase ? 'text-green-500' : 'text-red-500'}`}>
                                    {hasUpperCase ? 'Contiene al menos una mayúscula' : 'Debes incluir al menos una mayúscula'}
                                </div>
                                <div className={`text-sm ${hasNumber ? 'text-green-500' : 'text-red-500'}`}>
                                    {hasNumber ? 'Contiene al menos un número' : 'Debes incluir al menos un número'}
                                </div>
                                <div className={`text-sm ${passwordLength ? 'text-green-500' : 'text-red-500'}`}>
                                    {passwordLength ? 'La contraseña tiene al menos 8 caracteres' : 'La contraseña debe tener al menos 8 caracteres'}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-500 ml-2">Confirma la contraseña</label>
                                <div className="relative">
                                    <input
                                        value={passwordS}
                                        placeholder="Confirma tu contraseña"
                                        type={showPassword2 ? "text" : "password"}
                                        id="confirm_password"
                                        name="confirm_password"
                                        className="bg-gray-100 mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                        required
                                        onChange={handlePasswordVerifyChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword2(!showPassword2)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
                                    >
                                        {showPassword2 ? (
                                            <svg className="mt-1 w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                <path fill="#9e9e9e" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                                            </svg>
                                        ) : (
                                            <svg className="mt-1 w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                <path fill="#9e9e9e" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.1-2.2 19.7-5.7 28.5L223.1 149.5zM288 240c-35.3 0-64 28.7-64 64c0 35.3 28.7 64 64 64s64-28.7 64-64s-28.7-64-64-64z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="w-full mb-2 lg:mb-0 mt-5">
                                <button type="button" className="py-3 w-full flex justify-center items-center gap-2 bg-stone-800 text-sm text-gray-100 p-2 rounded-lg hover:bg-stone-950 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-950 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4" id="google">
                                        <path fill="#fbbb00" d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"></path>
                                        <path fill="#518ef8" d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"></path>
                                        <path fill="#28b446" d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"></path>
                                        <path fill="#f14336" d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"></path>
                                    </svg> Continuar con Google </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                            >
                                Registrarse
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors duration-300"
                            >
                                Continuar como invitado
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;