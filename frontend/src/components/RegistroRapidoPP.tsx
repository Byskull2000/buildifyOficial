import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import PasswordStrengthBar from "react-password-strength-bar";
import logo from "../assets/Buildify.png";

interface RegistroRapidoPPProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegistroRapidoPP: React.FC<RegistroRapidoPPProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordS, setPasswordS] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const scoreWords = [
    "Muy débil",
    "Débil",
    "Aceptable",
    "Fuerte",
    "Muy fuerte",
  ];

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordS) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (passwordScore < 3) {
      setError("La contraseña no es suficientemente fuerte");
      return;
    }

    const body = {
      nombre_usuario: nombre,
      correo_electronico: email,
      contrasenia: password,
      numero_telefono: null,
    };

    try {
      const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
      const res = await fetch(`${URL_BACKEND}/api/RegistrarUsuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        setError(errorResponse.message || "Error al registrar usuario");
        return;
      }

      const { data } = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        window.location.reload(); // Recarga la página
      }, 1500);
    } catch (err) {
      setError("Error en la conexión con el servidor");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faEyeSlash} size="2x" />
        </button>

        <div className="text-center mb-6">
          <img src={logo} alt="Buildify" className="w-16 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-gray-800">Registro Rápido</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nombre
            </label>
            <div className="relative">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded-md pl-10 focus:ring-2 focus:ring-blue-400"
                placeholder="Ingresa tu nombre"
              />
              <FontAwesomeIcon
                icon={faUser}
                className="absolute top-3 left-3 text-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md pl-10 focus:ring-2 focus:ring-blue-400"
                placeholder="Ingresa tu correo electrónico"
              />
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute top-3 left-3 text-gray-400"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md pl-10 pr-10 focus:ring-2 focus:ring-blue-400"
                placeholder="Crea tu contraseña"
              />
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-3 left-3 text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </button>
            </div>
            <PasswordStrengthBar
              password={password}
              scoreWords={scoreWords}
              onChangeScore={(score) => setPasswordScore(score)}
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                value={passwordS}
                onChange={(e) => setPasswordS(e.target.value)}
                className="w-full p-2 border rounded-md pl-10 pr-10 focus:ring-2 focus:ring-blue-400"
                placeholder="Confirma tu contraseña"
              />
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-3 left-3 text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute top-3 right-3 text-gray-400"
              >
                <FontAwesomeIcon icon={showPassword2 ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>

          {/* Mensajes de error/success */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <p className="text-sm text-green-500">Registro exitoso</p>
          )}

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroRapidoPP;
