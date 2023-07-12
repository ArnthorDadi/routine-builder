import { toast } from "react-toastify";
import { ToastOptions } from "react-toastify/dist/types";

export function SuccessToast(message: string, options?: ToastOptions) {
  toast(
    message,
    options
      ? { type: "success", position: "top-right", ...options }
      : { type: "success", position: "top-right" }
  );
}
