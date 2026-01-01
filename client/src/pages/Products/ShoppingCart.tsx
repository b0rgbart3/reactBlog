import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../data/useData";
import { Order, useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";
import { formToJSON } from "axios";
import { useClickOutside } from "../../hooks/useClickOutside";

export function ShoppingCart() {

  useData();
  const { id } = useParams<{ id: string }>();

  const { user, articles, loading, products, users, setUser, orders, setOrders } = useStore((s) => s);

    const navigate = useNavigate();

  const removeOrder = useCallback((itemToRemove) => {
    console.log('Remove: ', itemToRemove);
    const newOrderSet = orders.filter((order) => order._id !== itemToRemove );
    setOrders(newOrderSet);
  }, orders);

    const proceedToCheckout = useCallback(() => {
      navigate('/check-out');
    }, []);

      const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    quantity: 1,
    size: "M",
    notes: ""
  });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
    // send to API here
  };


  return (
    <>

      <BannerNav page='product' />
      <div className='basicBox'>

        <div>
          <h1>Your Shopping Cart:</h1></div>
        Orders: {orders.length}


        <div className='ordersContainer'>
          {orders.map((order) => {
            const associatedProduct = products.find((product) => product._id === order.productID);

            return (
              <div className='orderBox'>

                Order:
                <div className='orderProductImg'><img src={associatedProduct.beauty}/></div>
                <div>Product: {associatedProduct.productName}</div>
                <div>Quantity: {order.quantity}</div>
                <div>Size: {order.chosenSize}</div>
                <div className='removeOrder' onClick={() => removeOrder(order._id)}>Remove this order</div>
              </div>
            )
          })}
        </div>

         <form onSubmit={proceedToCheckout} className="orderForm">
      <h2>Customer Info</h2>

      {/* Customer Info */}
      <fieldset>
        <legend>Customer Information</legend>

        <label>
          First Name
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            placeholder="555-123-4567"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
      </fieldset>

      {/* Shipping Address */}
      <fieldset>
        <legend>Shipping Address</legend>

        <label>
          Address Line 1
          <input
            type="text"
            name="address1"
            required
            value={formData.address1}
            onChange={handleChange}
          />
        </label>

        <label>
          Address Line 2 (optional)
          <input
            type="text"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
          />
        </label>

        <label>
          City
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
          />
        </label>

        <label>
          State
          <input
            type="text"
            name="state"
            required
            maxLength={2}
            placeholder="CA"
            value={formData.state}
            onChange={handleChange}
          />
        </label>

        <label>
          ZIP Code
          <input
            type="text"
            name="zip"
            required
            value={formData.zip}
            onChange={handleChange}
          />
        </label>
      </fieldset>

    
      
      {/* Optional Notes */}
      <fieldset>
        <legend>Additional Notes</legend>

        <textarea
          name="notes"
          rows={4}
          placeholder="Special delivery instructions or notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </fieldset>

              <button type='submit'>Proceed To Checkout</button>
    </form>


      </div>
    </>
  )


}