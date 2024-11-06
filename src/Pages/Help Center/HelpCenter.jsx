import useFetch from "../../Hooks/UseFetch"

function HelpCenter() {
  const {data} = useFetch('http://localhost:5001/helpCenter')
  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto">
        <div className="flex flex-col items-center py-7">
          <h2 className="text-3xl font-mono">Welcome to the Help Center</h2>
          <h4>How can we help you?</h4>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-5 mb-10">
          {
            data.map((card)=>(
              <div key={card.id} className='flex flex-col items-center py-8 bg-[#E8F0FE] rounded-md '>
                <img src={card.img} alt="" />
                <h2>{card.title}</h2>
                <h4>{card.subtitle}</h4>
              </div>
            ))
          }
        </div>

        
      </div>
    </div>
  )
}

export default HelpCenter