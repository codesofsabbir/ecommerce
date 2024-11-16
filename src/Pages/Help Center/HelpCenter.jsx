import useFetch from "../../Hooks/UseFetch"

function HelpCenter() {
  const {data} = useFetch('http://localhost:5001/helpCenter')
  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto">
        <div className="flex flex-col items-center py-7">
          <h2 className="text-xl md:text-3xl font-mono">Welcome to the Help Center</h2>
          <h4 className="text-sm text-gray-500">How can we help you?</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-5 mb-10">
          {
            data.map((card)=>(
              <div key={card.id} className='flex flex-col items-center justify-center py-5 px-3 bg-[#E8F0FE] rounded-md '>
                <img src={card.img} alt="" className=" aspect-square" loading="lazy"/>
                <h2 className="text-sm md:text-xl font-semibold text-center">{card.title}</h2>
                <h4 className="text-sm text-gray-500 text-center">{card.subtitle}</h4>
              </div>
            ))
          }
        </div>

        
      </div>
    </div>
  )
}

export default HelpCenter