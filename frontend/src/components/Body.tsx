import { Link } from 'react-router-dom';
const Page = () => {

    return (
        <div>
            
            <Link
                to="/registroRapido"
                className="text-blue-500 hover:underline"
            >
                Prueba registro Rápido
            </Link>
            <br></br> 
            
            <Link
                to="/subirImagenes"  
                className="text-blue-500 hover:underline"
            >
                Subir Foto
            </Link>
        </div>
        
  
    );
};

export default Page;