// Todas las imagenes deben estar en /src/assets
import NavBar from "../components/NavBar";
import PopupRegristro from "../components/RegistroRapidoPP";
import ImagenPrueba from "../pages/ImagenPrueba";
import InterestList from "../components/InteresList";
import { Link } from "react-router-dom";
import DireccionesEntrega from "./DireccionesEntrega";
function App() {
  const userStorage =
  sessionStorage.getItem("user") || localStorage.getItem("user") || null;
  const user = userStorage ? JSON.parse(userStorage) : null;
  return (
    <>
      <div className="bg-white">
        <NavBar />
        <PopupRegristro></PopupRegristro>
        <ImagenPrueba></ImagenPrueba>
        <InterestList></InterestList>

        {user &&(
        <Link to="/editProfile" className="text-blue-500 hover:underline">
          Edicion de perfil
        </Link>
         )}

        <DireccionesEntrega />

        {user &&(
        <Link to="/publicProfile" className="text-blue-500 hover:underline">
        Perfil publico
        </Link>
        )}
      </div>
    </>
  );
}

export default App;
