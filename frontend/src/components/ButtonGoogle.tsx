import { useGoogleLogin } from "@react-oauth/google";
import GoogleLogo from "../assets/google.svg";

const ButtonGoogle = () => {
    const login = useGoogleLogin({
        onSuccess: (response) => console.log(response),
        onError: (error) => console.log("Error en el Login: ", error)
    })

    return (
        <button className="flex items-center justify-center bg-black text-white rounded-md p-2 gap-2 w-80" onClick={()=> login()}>
            <img src={GoogleLogo} alt="Google Logo" className="h-8" />
            Continuar con Google
        </button>
    );
};

export default ButtonGoogle;
