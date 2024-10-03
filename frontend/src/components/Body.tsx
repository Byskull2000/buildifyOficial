import { Link } from 'react-router-dom';
const Page = () => {

    return (
        <Link
            to="/registroRapido"
            className="text-blue-500 hover:underline"
        >
            Prueba registro Rapido
        </Link>
    );
};

export default Page;