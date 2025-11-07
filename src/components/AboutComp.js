import styles from "@/styles/About.module.css";

const AboutComp = () => {
  return (
    <div id="about" className={styles.container}>
      <p>
        <strong>Unequivocal</strong> Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Nunc quis tempor metus. Nullam ac finibus ipsum. Cras
        sodales, neque ac dapibus placerat, nunc libero tristique eros, vitae
        pellentesque risus libero ac dolor.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales,
        dolor sed pharetra luctus, risus lorem mattis lacus, vel ullamcorper
        metus purus sed justo. Maecenas molestie massa a bibendum porta. Morbi
        aliquam ornare nulla ac ultrices. Fusce iaculis dapibus nisi id
        fermentum. Vivamus fringilla sapien ut nunc blandit, sit amet
        pellentesque nisi pretium. Integer vel felis et dui pulvinar mollis.
      </p>
      <p>
        Nam sit amet dignissim tellus. Sed non tristique massa, ut scelerisque
        ipsum. Phasellus vitae enim velit. Sed eleifend, nibh eu commodo
        dapibus, tortor tellus ultrices elit, a aliquam orci erat eu lacus.
      </p>
      <p>
        Vivamus volutpat at orci id aliquam. Ut nec enim molestie, ullamcorper
        sapien at, placerat justo. Vestibulum mattis nisi non lectus vestibulum,
        sed iaculis orci facilisis. Morbi pretium hendrerit lacus vel lobortis.
      </p>
      <hr />
      <p className={styles.email}>
        <span>Contact:</span>{" "}
        <a href="mailto:info@unequivocalmusic.com">info@unequivocalmusic.com</a>
      </p>
    </div>
  );
};

export default AboutComp;
