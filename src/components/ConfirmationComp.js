import styles from "@/styles/About.module.css";

const ConfirmationComp = () => {
  return (
    <div className={styles.container}>
      <p>
        Welcome to <strong>Unequivocal</strong> we have sent you an email with
        your username and temporary password.
      </p>
      <p>
        Head to your email and log in with the details provided. Once you have
        done that you will be asked to update your password, after which you
        will be able to access the <strong>Unequivocal</strong> library.
      </p>
      <hr />
      <p className={styles.email}>
        If you are experiencing any problems do not hesitate to contact us{" "}
        <a href="mailto:info@unequivocalmusic.com">info@unequivocalmusic.com</a>
      </p>
    </div>
  );
};

export default ConfirmationComp;
