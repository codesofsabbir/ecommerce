/* eslint-disable react/prop-types */
function ProductDetailsTable({product}) {

  return (
    <div className=''>
        <table className='min-w-full table-auto border-collapse border border-gray-300 text-gray-600'>
            <thead>
                <tr className='bg-gray-100 text-left'>
                    {
                        ["Variants", "Color", "Sold", "Stock", "Total Stock"].map((th)=>(
                            <th key={th} className='text-center'>{th}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    product?.variants?.map((variant, index) => {
                        const totalStock = variant.colors.reduce((sum, color)=> sum + color.stock, 0);
                        return(

                            <tr key={index}>
                                <td className="px-4 py-1 border border-gray-400">{variant.type}</td>
                                <td className="px-4 py-1 border border-gray-400">{variant?.colors?.map((color)=>(
                                    <tr key={color?.color} className="">{color?.color}</tr>
                                ))}</td>
                                <td className="px-4 py-1 border border-gray-400">{variant?.colors?.map((color, index)=>(
                                    <tr key={`${color?.color}-${color.sold}${index}`} className="">{color?.sold}</tr>
                                ))}</td>
                                <td className="px-4 py-1 border border-gray-400">{variant?.colors?.map((color, index)=>(
                                    <tr key={`${color?.color}-${color.stock}${index}`} className="">{color?.stock}</tr>
                                ))}</td>
                                <td className="px-4 py-1 border border-gray-400">{totalStock}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div>
  )
}

export default ProductDetailsTable