/* eslint-disable react/prop-types */
import { X, Minus, Plus } from 'lucide-react';

function CartTable({ products, handleQuantityChange, handleRemoveProduct }) {
  return (
    <div className="overflow-y-auto w-full lg:w-3/5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Product</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Quantity</th>
            <th scope="col" className="px-6 py-3">Total</th>
            <th scope="col" className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <img
                  className="w-10 h-10 aspect-square rounded-md"
                  src={product.image}
                  alt={product.productName}
                  loading="lazy"
                />
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    {product?.productName.split(' ').length > 6
                      ? `${product.productName.split(' ').slice(0, 6).join(' ')}...`
                      : product?.productName}
                  </div>
                  <div className="font-normal text-gray-500 flex gap-1">
                    {product.variantType && <span className="capitalize">{product.variantType} |</span>}
                    {product.color && <span>{product.color}</span>}
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">{product.price}</td>
              <td className="px-6 py-4">
                <div className="flex items-center w-fit px-5 border border-gray-300 rounded-full mx-auto">
                  <Minus
                    size={20}
                    onClick={() => handleQuantityChange(product.id, product.quantity, false)}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                  <span className="mx-5">{product.quantity}</span>
                  <Plus
                    size={20}
                    onClick={() => handleQuantityChange(product.id, product.quantity, true)}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                </div>
              </td>
              <td className="px-6 py-4">{(product.price * product.quantity).toFixed(2)}</td>
              <td className="w-4 p-4">
                <X
                  size={20}
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveProduct(product.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CartTable;
