// Todas las imagenes deben estar en /src/assets
import NavBar from '../components/NavBar';
import PopupRegristro from '../components/RegistroRapidoPP';
import ImageUpload from '../pages/ImageUpload';
function App() {
    return (
        <>
            <div className="bg-white">
                <NavBar/>
                <PopupRegristro></PopupRegristro>
                <ImageUpload></ImageUpload>
            </div>
        </>
    );
}

export default App;
