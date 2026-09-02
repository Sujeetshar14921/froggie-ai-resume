import React from "react";
import { Toaster } from "react-hot-toast";
import FroggieToast from "./FroggieToast";

/**
 * Top-Level Froggie Toaster Provider
 * Replaces standard unstyled react-hot-toast container with
 * custom glassmorphism notification cards across the entire application.
 */
export const FroggieToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
        zIndex: 999999,
        pointerEvents: "none",
      }}
      toastOptions={{
        duration: 4200,
      }}
    >
      {(t) => <FroggieToast toast={t} />}
    </Toaster>
  );
};

export default FroggieToaster;
