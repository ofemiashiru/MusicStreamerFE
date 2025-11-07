import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import styles from "@/styles/ManageSubscriptions.module.css";

import { Noto_Sans_JP } from "next/font/google";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  display: "swap",
});

const ManageSubscription = ({ session }) => {
  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    setUserEmail(session.tokens.signInDetails.loginId);
  }, [session]);

  const redirectToStripePortal = async () => {
    // 1. You must have the Stripe Customer ID for the logged-in user.
    if (!userEmail) {
      console.error("Customer ID is missing. Cannot open portal.");
      return;
    }

    try {
      // 2. Call your custom backend endpoint to create the Portal Session
      const response = await fetch(
        "https://vtmk7twmql.execute-api.eu-west-1.amazonaws.com/dev/create-portal-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Send the customer ID securely to your server endpoint
          body: JSON.stringify({ email: userEmail }),
        }
      );

      const data = await response.json();

      if (response.ok && data.url) {
        // 3. Redirect the user to the Stripe-hosted Customer Portal
        window.location.assign(data.url);
      } else {
        // Handle error from server
        console.error("Failed to get portal session URL:", data.message);
      }
    } catch (error) {
      console.error("Network or redirect error:", error);
    }
  };

  return (
    <div className={styles.manage}>
      <button onClick={redirectToStripePortal} title="Manage Subscription">
        <UserRound />
      </button>
    </div>
  );
};

export default ManageSubscription;
