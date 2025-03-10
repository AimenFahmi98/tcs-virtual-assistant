import React from "react";

/**
 * A reusable spinner component that displays a loading animation.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} [props.color="var(--color-text)"] - The color of the spinner (CSS color value)
 * @param {string} [props.size="32px"] - The size of the spinner (CSS dimension value)
 * @param {string} [props.borderSize="4px"] - The thickness of the spinner's border (CSS dimension value)
 * @returns {JSX.Element} A centered spinning circle animation
 */
function Spinner({
  color = "var(--color-text)",
  size = "32px",
  borderSize = "4px",
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="animate-spin rounded-full"
        style={{
          borderTopColor: "transparent", // Ensures only one part is transparent for the spinning effect
          borderRightColor: color, // Sets the main spinner color
          borderBottomColor: color, // Ensures consistent styling
          borderLeftColor: color, // Ensures consistent styling
          width: size, // Dynamically sets the spinner width
          height: size, // Dynamically sets the spinner height
          borderWidth: borderSize, // Sets the border size dynamically
          borderStyle: "solid", // Ensures the border style is consistent
        }}
      ></div>
    </div>
  );
}

export default Spinner;
