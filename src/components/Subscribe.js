import { loadStripe } from "@stripe/stripe-js";
import StripeLogo from "./svgs/StripeLogo";

import styles from "@/styles/Subscribe.module.css";

import { Noto_Sans_JP } from "next/font/google";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  display: "swap",
});

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
      successUrl: "http://localhost:3000/subscription-confirmation",
      cancelUrl: "http://localhost:3000",
    });
  };
  return (
    <div className={styles.subscribe}>
      <button onClick={signInAsFan} className={notoSansJP.className}>
        No account? Sign up with <StripeLogo />
      </button>
    </div>
  );
}
