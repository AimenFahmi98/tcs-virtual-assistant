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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary_light p-4 text-text">
      <div className="w-full max-w-4xl rounded-xl bg-background p-8 shadow-xl md:p-12">
        <div className="mb-8 border-l-4 border-blue-600 pl-6">
          <h1 className="mb-2 text-3xl font-semibold md:text-4xl">
            Page under development
          </h1>
          <p className="text-lg text-text_light">
            This page is currently being worked on
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-1 animate-pulse rounded-full bg-blue-600"></div>
            <p className="text-xl font-light text-text">
              We&apos;re actively developing new features and optimizing
              functionality 🚀✨
            </p>
          </div>

          <div className="rounded-lg bg-background p-6">
            <h2 className="mb-3 text-lg font-medium text-text">
              Expected Improvements
            </h2>
            <ul className="space-y-2 text-text_light">
              <li className="flex items-center">
                <span className="mr-3 h-2 w-2 rounded-full bg-blue-600"></span>
                Enhanced user interface and experience
              </li>
              <li className="flex items-center">
                <span className="mr-3 h-2 w-2 rounded-full bg-blue-600"></span>
                Improved system performance and reliability
              </li>
              <li className="flex items-center">
                <span className="mr-3 h-2 w-2 rounded-full bg-blue-600"></span>
                Additional features and capabilities
              </li>
            </ul>
          </div>

          <p className="border-t pt-6 text-sm text-text_light">
            We appreciate your patience during this enhancement period. For
            immediate assistance, please contact system administration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageYetToBeWorkedOn;
