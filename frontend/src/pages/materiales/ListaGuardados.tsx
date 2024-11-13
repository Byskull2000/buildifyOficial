import React from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  description: string;
}

// Lista 
const savedProducts: Product[] = [
  {
    id: 1,
    title: 'Arena',
    price: 100,
    quantity: 5,
    description: 'Recien llegado',
  },
  {
    id: 2,
    title: 'Ladrillo',
    price: 200,
    quantity: 10,
    description: 'Envio gratis',
  },
  {
    id: 3,
    title: 'Ladrillo de 6 huecos',
    price: 300,
    quantity: 15,
    description: 'Nuevo ingreso industria chilena',
  },
];

const ListaGuardados: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">Productos guardados</h2>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        {savedProducts.length === 0 ? (
          <p className="text-center text-lg text-gray-500">La lista está vacía</p>
        ) : (
          savedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-start p-6 mb-6 bg-gray-100 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex-shrink-0 w-36 h-36 bg-gray-400 rounded-lg">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Producto"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="flex-1 ml-6">
                <h3 className="text-2xl font-semibold">{product.title}</h3>
                <p className="text-lg text-gray-700">
                  PRECIO: Bs. {product.price} CANTIDAD: {product.quantity}
                </p>
                <p className="text-lg text-gray-600">{product.description}</p>
                <button className="px-6 py-3 mt-4 text-lg font-semibold text-white bg-orange-400 rounded-md hover:bg-orange-600">
                  Ver publicación
                </button>
              </div>
              <div className="ml-6">
                <button aria-label="Guardar" className="text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-8 h-8"
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
  );
};

export default ListaGuardados;
 
