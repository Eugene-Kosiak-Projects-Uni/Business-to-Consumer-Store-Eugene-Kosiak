import { expect, test, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import { CartProvider, useCart } from "./CartContext";


const product = {
  id:1,
  title:"Keyboard",
  stock:2,
  price:100,
  imageUrl:"image.png",
} as any;



function TestComponent(){

  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity
  } = useCart();


  return (
    <div>

      <p data-testid="count">
        {cart.length}
      </p>


      <button
        onClick={() =>
          addToCart(product)
        }
      >
        Add
      </button>


      <button
        onClick={() =>
          removeFromCart(1)
        }
      >
        Remove
      </button>


      <button
        onClick={() =>
          clearCart()
        }
      >
        Clear
      </button>


      <button
        onClick={() =>
          updateQuantity(1,5)
        }
      >
        Max
      </button>


      <p data-testid="quantity">
        {cart[0]?.quantity}
      </p>

    </div>
  )
}



beforeEach(()=>{

 localStorage.clear();

});



test("adds product to cart", async()=>{


 const {getByText,getByTestId}=render(
   <CartProvider>
      <TestComponent/>
   </CartProvider>
 );


 await getByText("Add").click();


 await expect
 .element(
   getByTestId("count")
 )
 .toHaveTextContent("1");


});



test("removes product from cart", async()=>{


 const {
   getByText,
   getByTestId
 }=render(
   <CartProvider>
      <TestComponent/>
   </CartProvider>
 );


 await getByText("Add").click();

 await getByText("Remove").click();


 await expect
 .element(
   getByTestId("count")
 )
 .toHaveTextContent("0");


});



test("prevents quantity exceeding stock", async()=>{


 const {
   getByText,
   getByTestId
 }=render(
   <CartProvider>
      <TestComponent/>
   </CartProvider>
 );


 await getByText("Add").click();


 await getByText("Max").click();


 await expect
 .element(
   getByTestId("quantity")
 )
 .toHaveTextContent("2");


});