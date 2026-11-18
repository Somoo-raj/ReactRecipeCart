import { useReducer } from "react";
import "./CartItem.css";

// Displays the available products and manages the shopping cart.
function CartItem() {
    // Product data shown in the "Add to cart" section.
    const products = [
        { id: 1, name: "Pizza", price: 200 },
        { id: 2, name: "Burger", price: 100 },
        { id: 3, name: "Pasta", price: 150 }
    ];

    // The cart starts empty.
    const initialState = { cart: [] };

    // Applies cart actions and returns the next state without mutating the current state.
    function reducer(state, action) {
        switch (action.type) {
            case "ADD_TO_CART": {
                // If the product is already in the cart, increase its quantity.
                if (state.cart.find(
                    (item) => item.id === action.payload.id
                )) {
                    return {
                        ...state,
                        cart: state.cart.map((item) =>
                            item.id === action.payload.id
                                ? { ...item, qty: item.qty + 1 }
                                : item
                        )
                    };
                }
                // Otherwise, add the product with an initial quantity of one.
                return {
                    ...state,
                    cart: [...state.cart, { ...action.payload, qty: 1 }]
                };
            }
            case "INCREASE_QTY": {
                // Increase the quantity of the product with the matching ID.
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                        item.id === action.payload
                            ? { ...item, qty: item.qty + 1 }
                            : item
                    )
                };
            }
            case "DECREASE_QTY": {
                // Decrease the matching product's quantity, or remove it when it reaches zero.
                return {
                    ...state,
                    cart: state.cart.flatMap((item) => {
                        if (item.id !== action.payload) return [item];
                        if (item.qty === 1) return [];
                        return [{ ...item, qty: item.qty - 1 }];
                    })
                };
            }
            case "CLEAR_CART": {
                // Remove all products from the cart.
                return {
                    ...state,
                    cart: []
                }
            }
            // Keep the current state when the action type is not recognized.
            default:
                return state;
        }
    }

    // Provides the current cart state and a function for dispatching cart actions.
    const [state, dispatch] = useReducer(reducer, initialState);

    // Calculate the combined price of all items in the cart.
    const totalPrice = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0)

    // Calculate the total number of individual items in the cart.
    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);

    // Dispatch the appropriate action to increase or decrease a product's quantity.
    function updateQuantity(id, amount) {
        dispatch({
            type: amount > 0 ? "INCREASE_QTY" : "DECREASE_QTY",
            payload: id
        });
    }

    // Dispatch the action that empties the cart.
    function clearCart() {
        dispatch({ type: "CLEAR_CART" })
    }

    return (
        <main className="cart-page">
            {/* Show the page title and the total item count. */}
            <header className="cart-header">
                <div>
                    <p className="cart-eyebrow">YOUR ORDER</p>
                    <h1>RecipeCart</h1>
                </div>
                <span className="cart-count" aria-live="polite">🛒 {totalQty} items</span>
            </header>

            {/* Show an empty-cart message or the products currently in the cart. */}
            <section className="cart-section" aria-label="Cart items">
                {state.cart.length === 0 ? (
                    <p className="cart-empty">Your cart is empty. Add something below.</p>
                ) : (
                    // Render each cart item with its price and quantity controls.
                    state.cart.map((item) => (
                        <article className="cart-item" key={item.id}>
                            <div className="cart-item-info">
                                <h2>{item.name}</h2>
                                <p>₹ {item.price} each</p>
                            </div>
                            <div className="cart-item-actions">
                                <strong>₹ {item.price * item.qty}</strong>
                                <div className="quantity-control">
                                    <button
                                        aria-label={`Decrease ${item.name} quantity`}
                                        className="quantity-button"
                                        onClick={() => updateQuantity(item.id, -1)}
                                        type="button"
                                    >
                                        -
                                    </button>
                                    <span aria-live="polite">{item.qty}</span>
                                    <button
                                        aria-label={`Increase ${item.name} quantity`}
                                        className="quantity-button"
                                        onClick={() => updateQuantity(item.id, 1)}
                                        type="button"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))
                )}
                {/* Display the cart total and allow the user to clear the cart. */}
                <div className="cart-total">
                    <span>Total</span>
                    <strong>₹ {totalPrice}</strong>
                </div>
                <button
                    className="button button-clear"
                    disabled={state.cart.length === 0}
                    onClick={clearCart}
                    type="button"
                >
                    Clear cart
                </button>
            </section>

            {/* Render a button for each product so it can be added to the cart. */}
            <section className="products-section" aria-label="Available products">
                <h2>Add to cart</h2>
                <div className="product-list">
                    {products.map((product) => (
                        <button
                            className="product-button"
                            key={product.id}
                            onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}
                            type="button"
                        >
                            <span>{product.name}</span>
                            <strong>₹ {product.price}</strong>
                            <span className="product-add">Add +</span>
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default CartItem;