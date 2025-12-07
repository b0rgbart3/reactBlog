import { useParams } from "react-router-dom";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";


export function ProductPage() {

    useData();
    const { id } = useParams<{ id: string }>();

    const { user, articles, loading, products, users, setUser } = useStore((s) => s);

    const product = products.find((product) => product._id === id);
    return (
        <>
            <BannerNav page='product' />

            <div className='productBeauty'>
                <img src={`${product?.beauty}`} alt="headline" />
            </div>

            <div className='prodcutTitle'>
              {product.productName}
            </div>

            <div className='productDescriptionBlock'>
              {product.productDescription}
            </div>
        </>
    )


}