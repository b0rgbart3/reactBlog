import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";

export function ProductPage() {

  useData();
  const { id } = useParams<{ id: string }>();

  const { user, articles, loading, products, users, setUser } = useStore((s) => s);
  const [chosenSize, setChosenSize] = useState('');
  const [count, setCount] = useState<number>(1);

  const addQuantity = useCallback(() => {
      console.log('BD: current count: ', count);
      if (count <= 19) {
    const newCount = count + 1;
    setCount(newCount);
      }
  }, [count]);

    const reduceQuantity = useCallback(() => {
      if (count >= 1) {
    setCount(count - 1);
      }
  }, [count]);

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


          <div className='countSelection'>
            <div className='counter' id='counter'>
              Quantity:
              <div className='counterBoxContainer'>
                <div className='counterBox'>{count}</div>
                <button className='quantityButton' onClick={reduceQuantity}>-</button>
                <button className='quantityButton' onClick={addQuantity}>+</button>
              </div>
                        <button className='cartButton'>Add to Cart</button>
            </div>
  
          </div>

          <div className='productDetails'>
            <p>Please note: If you want to order multiple sizes, please just add a quantity of each size to your cart, and then choose a different size, and a different quantity and add those to your cart.  Each time you click the add to cart button, it will place an additional order to your shopping cart.
            </p>
            {productDetails}
          </div>

        </div>
      </div>ƒ
    </>
  )


}