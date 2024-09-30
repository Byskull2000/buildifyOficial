import GoogleLogo from "../assets/google.svg";
const ButtonGoogle = () => {
    return (
        <button className="flex items-center justify-center bg-black text-white rounded-md p-2 gap-2 w-80">
            <img src={GoogleLogo} alt="Google Logo" className="h-8" />
            Continuar con Google
        </button>
    );
};

export default ButtonGoogle;
