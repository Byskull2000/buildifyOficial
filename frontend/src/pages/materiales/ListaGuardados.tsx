import React from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  description: string;
}

const savedProducts: Product[] = [
  {
    id: 1,
    title: 'Producto 1',
    price: 100,
    quantity: 5,
    description: 'Descripción del producto 1',
  },
  {
    id: 2,
    title: 'Producto 2',
    price: 200,
    quantity: 10,
    description: 'Descripción del producto 2',
  },
  {
    id: 3,
    title: 'Producto 3',
    price: 300,
    quantity: 15,
    description: 'Descripción del producto 3',
  },
];

const ListaGuardados: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Productos guardados</h2>
      {savedProducts.map((product) => (
        <div
          key={product.id}
          className="flex items-start p-4 mb-4 bg-gray-100 rounded-lg shadow-md"
        >
          <div className="flex-shrink-0 w-20 h-20 bg-gray-400 rounded-lg">
            <img
              src="https://via.placeholder.com/80"
              alt="Producto"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div className="flex-1 ml-4">
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <p className="text-sm text-gray-700">
              PRECIO: ${product.price} CANTIDAD: {product.quantity}
            </p>
            <p className="text-sm text-gray-600">{product.description}</p>
            <button className="px-4 py-2 mt-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900">
              Ver publicación
            </button>
          </div>
          <div className="ml-4">
            <button aria-label="Guardar" className="text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M5 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v18l-7-3-7 3V4z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaGuardados;