// src/utils/paymentUtils.ts
export const submitPaymentForm = (htmlForm: string, onSuccess?: () => void) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlForm;

  // Find the form element
  const form = tempDiv.querySelector("form");
  if (!form) {
    throw new Error("No form found in payment response");
  }

  // Create a hidden iframe to handle the redirect
  const iframe = document.createElement("iframe");
  iframe.name = "payment-iframe";
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  // Set form target to the iframe and submit
  form.target = "payment-iframe";
  document.body.appendChild(form);
  form.submit();

  // Listen for iframe load to detect when payment is complete
  iframe.onload = () => {
    // This will be called when the payment gateway redirects back
    if (onSuccess) {
      onSuccess();
    }

    // Clean up after submission
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 1000);
  };
};
