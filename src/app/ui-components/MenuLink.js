import Link from "next/link";

/**
 * A component that renders a menu link with an icon and title.
 * @component
 * @param {Object} props - The component props
 * @param {string} props.title - The text to display in the link
 * @param {React.ReactNode} props.icon - The icon element to display before the title
 * @param {string} props.href - The URL that the link should navigate to
 * @returns {JSX.Element} A Next.js Link component styled as a menu item
 */
function MenuLink({ title, icon, href }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-2 rounded-full border border-primary_darker px-4 py-2 text-sm hover:bg-primary_light"
    >
      {icon}
      <span className="max-w-24 truncate">{title}</span>
    </Link>
  );
}

export default MenuLink;
