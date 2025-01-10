import parse from "html-react-parser";
import styles from "../styles/Answer.module.css";

function HtmlBox({ children }) {
  return (
    <div
      className={`${styles.globalStyles} ${styles.tableStyles} ${styles.ulStyles} ${styles.pStyles} ${styles.hStyles}`}
    >
      {children !== undefined && parse(children)}
    </div>
  );
}

export default HtmlBox;
