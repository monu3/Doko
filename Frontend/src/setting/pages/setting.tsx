import { useState } from "react";
import { SettingsLayout } from "../settings-layout";
import { SettingsSection } from "../settings";
import { StoreDetailsForm } from "../components/storeDetails-form";
import { NotificationsForm } from "../components/notification-form";
import { PaymentsForm } from "../components/payment/payment-form";
import { CheckoutForm } from "../components/checkout-form";
import { LanguagesForm } from "../components/language-form";
import { PoliciesForm } from "../components/policies-form";
import { ShippingForm } from "../components/shipping-form";
import { SupportSocialForm } from "../components/supportSocial-form";
import { StoreAddressForm } from "../components/store-address-form";

export default function Setting() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("store-details");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "store-details":
        return <StoreDetailsForm />;
      case "store-address":
        return <StoreAddressForm />;
      case "notifications":
        return <NotificationsForm />;
      case "payments":
        return <PaymentsForm />;
      case "checkout":
        return <CheckoutForm />;
      case "shipping":
        return <ShippingForm />;
      case "languages":
        return <LanguagesForm />;
      case "support-social":
        return <SupportSocialForm />;
      case "policies":
        return <PoliciesForm />;
      default:
        return <StoreDetailsForm />;
    }
  };

  return (
    <SettingsLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderActiveSection()}
    </SettingsLayout>
  );
}
