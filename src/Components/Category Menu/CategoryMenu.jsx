import 'swiper/css';
import useAxios from "../../Hooks/useAxios";
import ComputerCategoryMenu from './category_components/ComputerCategoryMenu';
import MobileCategoryMenu from './category_components/MobileCategoryMenu';
function CategoryMenu() {
    const { data: categories=[], error, loading } = useAxios('http://localhost:5001/categories');
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;
    

    return (
        <div className="w-full">
            <div className="w-[90%] mx-auto pt-10">
                <h2 className="uppercase md:text-xl font-semibold ">Popular Categories</h2>
                <div className="hidden md:block">
                    <ComputerCategoryMenu categories={categories} />
                </div>
                <div className="md:hidden mt-7">
                    <MobileCategoryMenu categories={categories} />
                </div>
            </div>
        </div>
    );
}

export default CategoryMenu;
