import { loadStripe } from "@stripe/stripe-js";

import styles from "@/styles/Subscribe.module.css";

export default function Subscribe() {
  const signInAsFan = async () => {
    const stripe = await loadStripe(
      "pk_test_51Nn7NvClUCnFaeZaRDqrXMnJFRkDvWvzGytM0LMdBK4MBFtFtHclrbRU1rnYdGeCfRi2lq5o99NA7W2YnVyTw4It00xlbnuJF2"
    );
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: "price_1RydpzClUCnFaeZanaiax1D8",
          quantity: 1,
        },
      ],
      mode: "subscription",
      successUrl: "http://localhost:3000",
      cancelUrl: "http://localhost:3000",
    });
  };
  return (
    <div className={styles.subscribe}>
      <button onClick={signInAsFan}>
        Don't have an account? <span>Subscribe on Stripe</span>
      </button>
    </div>
  );
}
