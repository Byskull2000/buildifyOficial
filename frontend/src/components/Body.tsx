import { Link } from 'react-router-dom';
const Page = () => {

    return (
        <div>
            
            <Link
                to="/registroRapido"
                className="text-blue-500 hover:underline mb-4"
            >
                Prueba registro Rápido
            </Link>
            <br /> 
            
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