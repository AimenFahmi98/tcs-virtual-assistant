import parse from "html-react-parser";
import styles from "@/styles/Answer.module.css";

/**
 * A component that parses and renders HTML content with applied styles.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.children - The HTML content to be parsed and rendered
 * @returns {JSX.Element} A styled div containing the parsed HTML content
 *
 * @example
 * <HtmlBox>
 *   <p>Some HTML content</p>
 * </HtmlBox>
 */
function HtmlBox({ children, className }) {
  return (
    <div
      className={`${styles.globalStyles} ${styles.tableStyles} ${styles.ulStyles} ${styles.pStyles} ${styles.hStyles} ${className}`}
    >
      {children !== undefined && parse(children)}
    </div>
  );
}

export default HtmlBox;
