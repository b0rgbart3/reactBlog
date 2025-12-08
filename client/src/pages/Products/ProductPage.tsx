import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";
import "./ProductStyles.css";

export function ProductPage() {

  useData();
  const { id } = useParams<{ id: string }>();

  const { user, articles, loading, products, users, setUser } = useStore((s) => s);
  const [chosenSize, setChosenSize] = useState('');

  const selectSize = useCallback((size: string) => {
    console.log('BD: chose: ', size);
    setChosenSize(size);

  }, []);

  const productTypes = [
    'Gilden Adult Softstyle Short Sleeve Tshirt'
  ]

  const productDescriptions = [
    'Gilden Adult Softstyle Short Sleeve Tshirt'
  ]

  const productDetails = (<>Style #: G67000-3G3-S
    <p>
Material</p >
<ul>
  <li>
60% ring spun cotton | 40% polyester</li>
<li>
--- Was Formerly 67000 ---</li>
<li>
5.5 Oz/SqYd, 50% U.S. cotton/50% polyester</li>
<li>
Classic fit for loose comfort</li>
<li>
Cotton-soft moisture wicking fabric for active lifestyles</li>
<li>
Stay-dry comfort and coolness</li>
<li>
Taped neck and shoulders for comfort and durability</li>
<li>
Non-topstitched, classic width, rib collar</li>
<li>
Tear away label for customizable comfort</li>
<li>
Decorating techniques - Screen printing, embroidery, iron-on transfers, discharge and DTG</li>
<li>
Companion style: G8000</li>
<li>
Made with respect for the climate, energy and water</li>
</ul></>);


  const product = products.find((product) => product._id === id);
  return (
    <>

      <BannerNav page='product' />
      <div className='productPageLayout'>
        <div className='pplChild pplChild-left'>
          <div className='productBeauty'>
            <img src={`${product?.beauty}`} alt="headline" />


            <div className='prodcutTitle'>
              {product.productName}
            </div>

            <div className='productDescriptionBlock'>
              {product.productDescription}
            </div>
          </div>


        </div>
        <div className='pplChild pplChild-right'>
          Choose your size:
          <div className='sizeBoxes'>


            <div className={`sizeBox ${chosenSize === 'S' ? 'active' : ''}`} onClick={() => selectSize('S')}>S</div>
            <div className={`sizeBox ${chosenSize === 'M' ? 'active' : ''}`} onClick={() => selectSize('M')}>M</div>
            <div className={`sizeBox ${chosenSize === 'L' ? 'active' : ''}`} onClick={() => selectSize('L')}>L</div>
            <div className={`sizeBox ${chosenSize === 'XL' ? 'active' : ''}`} onClick={() => selectSize('XL')}>XL</div>
            <div className={`sizeBox ${chosenSize === 'XXL' ? 'active' : ''}`} onClick={() => selectSize('XXL')}>XXL</div>


          </div>

          <div>
            {productDetails}
          </div>
        </div>
      </div>
    </>
  )


}