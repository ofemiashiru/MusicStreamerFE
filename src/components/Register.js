import { loadStripe } from "@stripe/stripe-js";
import { signIn } from "aws-amplify/auth";

import styles from "@/styles/Register.module.css";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { Noto_Sans_JP } from "next/font/google";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  display: "swap",
});

const Register = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkEmail = async (e) => {
    e.preventDefault();
    setError("");
    let userExists = false;
    const DUMMY_PASSWORD = `#${crypto.randomUUID()}£$`;
    console.log(DUMMY_PASSWORD);
    try {
      setIsLoading(true);
      await signIn({
        username: email,
        password: DUMMY_PASSWORD,
      });
    } catch (error) {
      // User exists, but the password was wrong.
      if (error.name === "NotAuthorizedException") {
        userExists = true;
        setError("User already exists. Please sign in.");
      }

      // User does not exist.
      if (error.name === "UserNotFoundException") {
        console.log("user not found");
        userExists = false;
      }
      setIsLoading(false);
    }

    if (!userExists) {
      register();
    }
  };

  const register = async () => {
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
      customerEmail: email,
    });

    if (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.register}>
      <h2>
        Register {isLoading && <LoaderCircle className={styles.animatespin} />}
      </h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={checkEmail}>
        <input
          id="email"
          placeholder="Email"
          type="email"
          name="email"
          className={notoSansJP.className}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="submit"
          value="Register"
          className={notoSansJP.className}
        />
      </form>
    </div>
  );
};

export default Register;
