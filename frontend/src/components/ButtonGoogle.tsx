import { useGoogleLogin } from "@react-oauth/google";
import GoogleLogo from "../assets/google.svg";
import axios from "axios";

const ButtonGoogle = () => {
    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    }
                }
            )
            console.log(userInfo);
        },
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
