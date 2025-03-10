import HtmlBox from "../../common/HtmlBox";

function Answer({ children, className }) {
  return <HtmlBox className={className}>{children}</HtmlBox>;
}

export default Answer;
