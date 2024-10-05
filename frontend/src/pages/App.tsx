// Todas las imagenes deben estar en /src/assets
import NavBar from '../components/NavBar';
import PopupRegristro from '../components/RegistroRapidoPP';
//import ImageUpload from '../pages/ImageUpload';
import ImagenPrueba from '../pages/ImagenPrueba';
function App() {
    return (
        <>
            <div className="bg-white">
                <NavBar/>
                <PopupRegristro></PopupRegristro>
                <ImagenPrueba></ImagenPrueba>
            </div>
        </>
    );
}

export default App;
