// Todas las imagenes deben estar en /src/assets
import NavBar from '../components/NavBar';
import PopupRegristro from '../components/RegistroRapidoPP';
import ImageUpload from '../pages/ImageUpload';
import { Link } from 'react-router-dom';
function App() {
    return (
        <>
            <div className="bg-white">
                <NavBar/>
                <PopupRegristro></PopupRegristro>
                <ImageUpload></ImageUpload>
                <Link to="/editProfile"className="text-blue-500 hover:underline">Edicion de perfil</Link>
            </div>
        </>
    );
}

export default App;
