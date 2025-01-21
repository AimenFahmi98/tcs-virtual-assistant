import React from "react";

/**
 * A React component that displays an "Under Construction" message for pages that are yet to be implemented.
 * The component shows a styled message box with animated text and emojis indicating that the page is being worked on.
 *
 * @component
 * @returns {JSX.Element} A div container with a centered message box displaying the construction status
 *
 * @example
 * ```jsx
 * <PageYetToBeWorkedOn />
 * ```
 */
function PageYetToBeWorkedOn() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-primary_light to-primary_darker">
      <div className="rounded-xl bg-background bg-opacity-80 p-8 text-center shadow-lg">
        <h1 className="mb-8 animate-pulse text-3xl font-[600] text-text">
          🛠 Under Construction
        </h1>
        <p className="mb-4 text-lg text-text">
          We are working hard to bring this page to life. Stay tuned!
        </p>
        <p className="mb-4 text-base text-text">
          ⏳ Please be patient while we build something amazing for you.
        </p>
        <p className="text-base text-text">
          💪 Thank you for your understanding and support!
        </p>
      </div>
    </div>
  );
}

export default PageYetToBeWorkedOn;
