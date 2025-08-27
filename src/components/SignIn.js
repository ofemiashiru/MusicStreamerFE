import { useState } from "react";
import styles from "@/styles/SignIn.module.css";
import { LoaderCircle } from "lucide-react";

import {
  signIn,
  getCurrentUser,
  confirmSignIn,
  fetchAuthSession,
} from "aws-amplify/auth";

export default function SignIn({ setUser, setGroups }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // New state to track if a new password is required
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false);

  // New state to store the user-provided new password
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const logIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const { isSignedIn, nextStep } = await signIn({
        username,
        password,
      });

      if (isSignedIn) {
        console.log("Is signed in....");
        // If sign-in is complete, set the user.
        // Note: You may need to fetch the userId from the authenticated user object.
        // For example: const { userId } = await getCurrentUser();
        // For now, using a placeholder.
        const currentUser = await getCurrentUser();

        const session = await fetchAuthSession();
        const userGroups = session.tokens.idToken.payload["cognito:groups"];

        setUser(currentUser);
        setGroups(userGroups);
        setIsLoading(false);
      } else if (
        nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setIsLoading(false);
        // If a new password is required, update state to show the new password form.
        setIsNewPasswordRequired(true);
      }
    } catch (error) {
      console.error(error);
      // Handle different error types
      if (error.name === "NotAuthorizedException") {
        setError("Incorrect username or password. Please try again.");
      } else if (error.name === "UserNotFoundException") {
        setError("User not found. Please check your username.");
      } else {
        setError(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    setError("");

    try {
      // Confirm the sign-in with the new password.
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (isSignedIn) {
        // If sign-in is complete after confirming, set the user.
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const userGroups = session.tokens.idToken.payload["cognito:groups"];

        setUser(currentUser);
        setGroups(userGroups);
        setIsNewPasswordRequired(false);
        setIsLoading(false);
      } else {
        // Handle any other steps that may be required.
        console.log("Next step:", nextStep.signInStep);
      }
    } catch (error) {
      console.error(error);
      if (error.name === "NotAuthorizedException") {
        setError("Incorrect username or password. Please try again.");
      } else if (error.name === "UserNotFoundException") {
        setError("User not found. Please check your username.");
      } else {
        setError(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.signin}>
      <h2>
        Log in {isLoading && <LoaderCircle className={styles.animatespin} />}
      </h2>
      {error && <p className={styles.error}>{error}</p>}
      {!isNewPasswordRequired ? (
        // Render the regular sign-in form
        <form onSubmit={logIn}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input type="submit" value="Log In" />
        </form>
      ) : (
        // Render the new password form
        <form onSubmit={handleNewPassword}>
          <p>Your password must be updated. Please enter a new one.</p>
          <input
            type="password"
            name="new-password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input type="submit" value="Set New Password" />
        </form>
      )}
    </div>
  );
}
