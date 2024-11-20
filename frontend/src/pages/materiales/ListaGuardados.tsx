import buildifyLogo from "../../assets/Buildify.png";
import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  description: string;
  imagen: string;  // Cambié imageUrl a imagen
}

const initialProducts: Product[] = [
  {
    id: 1,
    title: 'Ladrillos 6 huecos',
    price: 200,
    quantity: 100,
    description: 'Ladrillos que sobraron en la construcción de un edificio venta por falta de utilidad para el dueño',
    imagen: 'https://via.placeholder.com/150',  // Cambié imageUrl a imagen
  },
  {
    id: 2,
    title: 'Ladrillos 6 huecos',
    price: 200,
    quantity: 100,
    description: 'Ladrillos que sobraron en la construcción de un edificio venta por falta de utilidad para el dueño',
    imagen: 'https://via.placeholder.com/150',  // Cambié imageUrl a imagen
  },
];

const ListaGuardados: React.FC = () => {
  const [savedProducts, setSavedProducts] = useState<Product[]>(initialProducts);
  //const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedProducts = async () => {
      try {
        const URL_BACKEND = import.meta.env.VITE_URL_BACKEND; // Variable de entorno definida en .env

        const res = await fetch(`${URL_BACKEND}/api/materiales/guardados`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Enviar cookies/sesión si es necesario
        });

        if (!res.ok) {
          throw new Error("Error al obtener los materiales guardados");
        }

        const responseData = await res.json();
        const formattedData = responseData.data.map((item: any) => ({
          id: item.id_material,
          title: item.nombre_material,
          price: item.precio_material,
          quantity: item.cantidad_material,
          description: item.descripcion_material,
          imagen: item.imagen || "https://via.placeholder.com/150",
        }));
        setSavedProducts(formattedData);
      } catch (err: any) {
        console.error(err.message);
        //setError(err.message || "Ocurrió un error inesperado");
      }
    };

    fetchSavedProducts();
  }, []); // Se ejecuta una vez al montar el componente

  const handleRemoveProduct = (productId: number) => {
    setSavedProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-300 font-nunito flex justify-between w-full sm:px-4 py-4">
        <Link to="/">
          <div className="flex items-center gap-2 px-2">
            <img
              src={buildifyLogo}
              alt="Logo de Buildify"
              className="h-14 w-14 mr-2 hidden sm:block"
            />
            <h1 className="self-center text-2xl font-black whitespace-nowrap hidden sm:block">
              Buildify
            </h1>
          </div>
        </Link>
      </div>

      {/* Main content */}
      <div className="p-4 w-2/3 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Publicaciones guardadas</h2>

        <div className="bg-white p-4 rounded-lg shadow-md">
          {savedProducts.length === 0 ? (
            <p className="text-center text-gray-500">La lista está vacía</p>
          ) : (
            savedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-start p-4 mb-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transform transition-all duration-200"
              >
                <div className="flex-shrink-0 w-36 h-36 bg-gray-200 rounded-md overflow-hidden">
                  {/* Aquí se carga la imagen desde la propiedad imagen */}
                  <img
                    src={product.imagen}  // Usamos la propiedad imagen
                    alt={product.title}
                    className="object-cover w-full h-full"  // Puedes cambiar el tamaño aquí
                  />
                </div>
                <div className="flex-1 ml-5">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">PRECIO:</span> Bs {product.price} <span className="ml-2 font-bold">CANTIDAD:</span> {product.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">DESCRIPCIÓN:</span> {product.description}
                  </p>
                  <button
                    onClick={() => alert('Ver Publicación')}
                    className="px-4 py-2 mt-2 text-sm font-semibold text-white bg-[#e3961b] rounded-md hover:bg-orange-600 transition duration-200"
                  >
                    Ver Publicación
                  </button>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    aria-label="Eliminar Producto"
                    className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow hover:bg-orange-600 transition duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-black"
                    >
                      <path d="M5 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v18l-7-3-7 3V4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaGuardados;
