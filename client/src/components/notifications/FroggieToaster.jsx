import React from "react";
import { Toaster } from "react-hot-toast";
import FroggieToast from "./FroggieToast";

/**
 * Top-Level Froggie Toaster Provider (Linear / Sonner Minimalist Pill Style)
 * Positioned cleanly at the bottom-right to never interrupt top navigation,
 * user profile, search bars, or main workflow.
 */
export const FroggieToaster = () => {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        bottom: 24,
        right: 24,
        zIndex: 999999,
        pointerEvents: "none",
      }}
      toastOptions={{
        duration: 3200,
      }}
    >
      {(t) => <FroggieToast toast={t} />}
    </Toaster>
  );
};

export default FroggieToaster;
