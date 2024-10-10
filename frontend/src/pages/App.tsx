// Todas las imagenes deben estar en /src/assets
import NavBar from "../components/NavBar";
import PopupRegristro from "../components/RegistroRapidoPP";
import ImagenPrueba from "../pages/ImagenPrueba";
import { Link } from "react-router-dom";
import Ubicaciones from "./Ubicaciones";
function App() {
  return (
    <>
      <div className="bg-white">
        <NavBar />
        <PopupRegristro></PopupRegristro>
        <ImagenPrueba></ImagenPrueba>
        <Link to="/editProfile" className="text-blue-500 hover:underline">
          Edicion de perfil
        </Link>
        <Ubicaciones />
      </div>
    </>
  );
}

export default App;
