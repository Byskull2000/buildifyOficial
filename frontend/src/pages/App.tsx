// Todas las imagenes deben estar en /src/assets
import NavBar from '../components/NavBar';
import PopupRegristro from '../components/RegistroRapidoPP';
function App() {
    return (
        <>
            <div className="bg-white">
                <NavBar/>
                <PopupRegristro></PopupRegristro>
            </div>
        </>
    );
}

export default App;
