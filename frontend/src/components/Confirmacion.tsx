import { useState } from "react";

const confirmacion = () => {
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    return (
        <div>
            <div className="">
                <button
                    className="mt-5 mb-2 py-2 bg-red-600 text-white p-2 font-semibold rounded-lg hover:bg-red-700 focus:outline-none"
                    onClick={togglePopup}
                >
                    Eliminar Publicacion
                </button>

                {/* Mostrar el PopUp de eliminación solo si el estado está activo */}
                {
                    isPopupVisible && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full align-middle relative">
                                <h1>¿Está seguro de desactivar la publicación?</h1>
                                <button
                                    onClick={togglePopup}
                                    className="absolute top-0 right-0 m-4 text-black hover:bg-gray-200 rounded-full p-1"
                                >
                                    &times;
                                </button>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={togglePopup}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={togglePopup}// Cambia esto a la función que maneje la confirmación
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        </div>

                    )
                }
            </div>
        </div >
    );
}

export default confirmacion