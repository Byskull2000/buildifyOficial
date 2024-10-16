// Todas las imagenes deben estar en /src/assets
import NavBar from "../components/NavBar";
import PopupRegristro from "../components/RegistroRapidoPP";
import ImagenPrueba from "../pages/ImagenPrueba";
import InterestList from "../components/InteresList";
import { Link } from "react-router-dom";
import DireccionesEntrega from "./DireccionesEntrega";
function App() {
<<<<<<< HEAD
    return (
        <>
            <div className="bg-white">
                <NavBar />
                <PopupRegristro></PopupRegristro>
                <ImagenPrueba></ImagenPrueba>
                <InterestList></InterestList>
                <Link
                    to="/editProfile"
                    className="text-blue-500 hover:underline"
                >
                    Edicion de perfil
                </Link>
            </div>
        </>
    );
=======
  return (
    <>
      <div className="bg-white">
        <NavBar />
        <PopupRegristro></PopupRegristro>
        <ImagenPrueba></ImagenPrueba>
        <Link to="/editProfile" className="text-blue-500 hover:underline">
          Edicion de perfil
        </Link>
        <DireccionesEntrega />
        <Link to="/publicProfile" className="text-blue-500 hover:underline">
        Perfil publico
        </Link>
      </div>
    </>
  );
>>>>>>> 038720d2f85f7d2ef4794053e8abafbd1989abea
}

export default App;
