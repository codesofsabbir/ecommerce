import Banner from "../../Components/banner/Banner"
import BannerSlider from "../../Components/BannerSlider/BannerSlider"
import CategoryMenu from "../../Components/Category Menu/CategoryMenu"
import CategoryProduct from "../../Components/Category Product/CategoryProduct"
function Home() {
  return (
    <div>
      
        <BannerSlider />
        <CategoryMenu />
        <Banner bannerId={0} />
        <CategoryProduct categoryId={0}/>
        <Banner bannerId={2} />
        <CategoryProduct categoryId={1}/>
        <Banner bannerId={1} />
        <CategoryProduct categoryId={2}/>
        <Banner bannerId={3} />
        <CategoryProduct categoryId={3}/>
        <Banner bannerId={4} />
        <CategoryProduct categoryId={4}/>
        <Banner bannerId={5} />
        <CategoryProduct categoryId={5}/>
        <Banner bannerId={6} />
        <CategoryProduct categoryId={6}/>
        <Banner bannerId={0} />
        <CategoryProduct categoryId={7}/>
    </div>
  )
}

export default Home