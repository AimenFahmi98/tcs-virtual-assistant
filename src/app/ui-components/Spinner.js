import React from "react";

function Spinner({
  color = "var(--color-text)",
  size = "32px",
  borderSize = "4px",
}) {
  return (
    <div className="flex h-full items-center justify-center">
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
