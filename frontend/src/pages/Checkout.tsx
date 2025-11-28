import React, { useState } from 'react'; // Added React import
import { HiTrash as TrashIcon } from "react-icons/hi2";
import { Button } from "../components/index.ts";
import { useAppDispatch, useAppSelector } from "../hooks/index.ts";
import { removeProductFromTheCart } from "../features/cart/cartSlice.tsx";
import customFetch from "../axios/custom.ts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { checkCheckoutFormData } from "../utils/checkCheckoutFormData.ts";
import { WhatsAppService, OrderData } from "../services/whatsappService.ts";

const paymentMethods = [
  { id: "cash-on-delivery", title: "Cash on Delivery" },
  { id: "bikash", title: "Bikash" },
  { id: "credit-card", title: "Credit card" },
  { id: "paypal", title: "PayPal" },
  { id: "etransfer", title: "eTransfer" },
];

const Checkout = () => {
  const { productsInCart, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const whatsappService = WhatsAppService.getInstance();
  const [selectedPayment, setSelectedPayment] = useState("cash-on-delivery"); // Moved inside component

  const formatOrderMessage = (orderData: any) => {
    const { data, products, subtotal } = orderData;
    const shipping = 5;
    const taxes = subtotal / 5;
    const total = subtotal + shipping + taxes;

    let message = `🛒 *NEW ORDER RECEIVED* 🛒\n\n`;
    
    // Customer Information
    message += `*Customer Details:*\n`;
    message += `👤 Name: ${data.firstName} ${data.lastName}\n`;
    message += `📞 Phone: ${data.phone}\n`;
    message += `📍 Address: ${data.address}, ${data.city}, ${data.region}, ${data.country} - ${data.postalCode}\n\n`;
    
    // Order Items
    message += `*Order Items:*\n`;
    products.forEach((product: any, index: number) => {
      message += `${index + 1}. ${product.title}\n`;
      message += `   Color: ${product.color} | Size: ${product.size}\n`;
      message += `   Price: $${product.price} x ${product.quantity} = $${product.price * product.quantity}\n\n`;
    });
    
    // Payment Information
    message += `*Payment Method:* ${data.paymentType}\n`;
    if (data.paymentType === 'bikash' && data.bikashNumber) {
      message += `Bikash Number: ${data.bikashNumber}\n`;
    }
    if (data.paymentType === 'credit-card' && data.nameOnCard) {
      message += `Card Holder: ${data.nameOnCard}\n`;
    }
    message += `\n`;
    
    // Order Summary
    message += `*Order Summary:*\n`;
    message += `Subtotal: $${subtotal.toFixed(2)}\n`;
    message += `Shipping: $${shipping.toFixed(2)}\n`;
    message += `Taxes: $${taxes.toFixed(2)}\n`;
    message += `*Total: $${total.toFixed(2)}*\n\n`;
    
    // Order Meta
    message += `Order Date: ${new Date().toLocaleString()}\n`;
    message += `Order ID: #${Date.now().toString().slice(-6)}`;
    
    return message;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const checkoutData = {
      data,
      products: productsInCart,
      subtotal: subtotal,
    };

    if (!checkCheckoutFormData(checkoutData)) return;

    let response;
    let orderData: OrderData;

    // Prepare order data
    if (JSON.parse(localStorage.getItem("user") || "{}").email) {
      orderData = {
        ...checkoutData,
        user: {
          email: JSON.parse(localStorage.getItem("user") || "{}").email,
          id: JSON.parse(localStorage.getItem("user") || "{}").id,
        },
        orderStatus: "Processing",
        orderDate: new Date().toISOString(),
      };
    } else {
      orderData = {
        ...checkoutData,
        orderStatus: "Processing",
        orderDate: new Date().toLocaleDateString(),
      };
    }

    try {
      // First, save order to database
      response = await customFetch.post("/orders", orderData);

      if (response.status === 201) {
        // Format and send WhatsApp message
        const whatsappMessage = formatOrderMessage(orderData);
        const phoneNumber = "+8801839502332"; // Bangladeshi number
        
        // Send to WhatsApp - Fixed: using only one argument
        const whatsappSuccess = await whatsappService.sendOrderToWhatsApp(orderData);

        // Handle different payment methods
        const paymentMethod = data.paymentType as string;
        
        if (paymentMethod === "cash-on-delivery") {
          toast.success("Order placed! Payment will be collected on delivery.");
        } else if (paymentMethod === "bikash") {
          toast.success("Order placed! Please complete payment via Bikash.");
        } else {
          toast.success("Order placed successfully!");
        }

        if (whatsappSuccess) {
          toast.success("Order details sent to WhatsApp!");
          
          // Open WhatsApp with pre-filled message
          const encodedMessage = encodeURIComponent(whatsappMessage);
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        } else {
          toast.success("Order placed! You can manually share details via WhatsApp.");
        }
        
        // Navigate after a short delay to see the toast
        setTimeout(() => {
          navigate("/order-confirmation");
        }, 3000);
      } else {
        toast.error("Something went wrong, please try again later");
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error("Something went wrong, please try again later");
    }
  };

  const renderPaymentFields = () => {
    switch (selectedPayment) {
      case "credit-card":
        return (
          <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
            <div className="col-span-4">
              <label
                htmlFor="card-number"
                className="block text-sm font-medium text-gray-700"
              >
                Card number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="card-number"
                  name="cardNumber"
                  autoComplete="cc-number"
                  className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                  required={true}
                />
              </div>
            </div>

            <div className="col-span-4">
              <label
                htmlFor="name-on-card"
                className="block text-sm font-medium text-gray-700"
              >
                Name on card
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name-on-card"
                  name="nameOnCard"
                  autoComplete="cc-name"
                  className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                  required={true}
                />
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="expiration-date"
                className="block text-sm font-medium text-gray-700"
              >
                Expiration date (MM/YY)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="expirationDate"
                  id="expiration-date"
                  autoComplete="cc-exp"
                  className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                  required={true}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cvc"
                className="block text-sm font-medium text-gray-700"
              >
                CVC
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="cvc"
                  id="cvc"
                  autoComplete="csc"
                  className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                  required={true}
                />
              </div>
            </div>
          </div>
        );
      
      case "bikash":
        return (
          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="bikash-number"
                className="block text-sm font-medium text-gray-700"
              >
                Bikash Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="bikash-number"
                  name="bikashNumber"
                  placeholder="01XXX-XXXXXX"
                  className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                  required={true}
                />
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Payment Instructions:</strong> After order confirmation, you will receive a payment request on your Bikash number. Please complete the payment to confirm your order.
              </p>
            </div>
          </div>
        );
      
      case "cash-on-delivery":
        return (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              <strong>Cash on Delivery:</strong> Pay when you receive your order. Our delivery agent will collect the payment at your doorstep.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="pb-24 pt-16 px-5 max-[400px]:px-3">
        <h2 className="sr-only">Checkout</h2>

        <form
          onSubmit={handleCheckoutSubmit}
          className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
        >
          <div>
            <div>
              <div className="mt-12">
                <h1 className="text-2xl font-bold text-gray-900">
                  Information
                </h1>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      name="firstName"
                      autoComplete="given-name"
                      className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      name="lastName"
                      autoComplete="family-name"
                      className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                      required={true}
                    >
                      <option>Bangladesh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="postalCode"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full py-2 indent-2 border border-gray-300 outline-none focus:border-gray-400 shadow-sm sm:text-sm"
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>

              <fieldset className="mt-4">
                <legend className="sr-only">Payment type</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                    <div key={paymentMethod.id} className="flex items-center">
                      <input
                        id={paymentMethod.id}
                        name="paymentType"
                        type="radio"
                        value={paymentMethod.id}
                        defaultChecked={paymentMethodIdx === 0}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={paymentMethod.id}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {paymentMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              {renderPaymentFields()}
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {productsInCart.map((product) => (
                  <li key={product?.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={`/assets/${product?.image}`}
                        alt={product?.title}
                        className="w-20 rounded-md"
                      />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                            {product?.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {product?.color}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {product?.size}
                          </p>
                        </div>

                        <div className="ml-4 flow-root flex-shrink-0">
                          <button
                            type="button"
                            className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                            onClick={() =>
                              dispatch(
                                removeProductFromTheCart({ id: product?.id })
                              )
                            }
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ${product?.price}
                        </p>

                        <div className="ml-4">
                          <p className="text-base">
                            Quantity: {product?.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${subtotal}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${subtotal ? 5 : 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Taxes</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${subtotal ? subtotal / 5 : 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    ${subtotal ? subtotal + 5 + subtotal / 5 : 0}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <Button text="Confirm Order" mode="brown" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;