/**
 * Contact Picker API utility to import contacts from the device
 * Uses the Contact Picker API available on Chrome, Edge, and Samsung Internet
 */

export interface ContactInfo {
  name?: string;
  phone?: string;
  address?: string;
}

export function supportsContactPicker() {
  return (
    typeof navigator !== "undefined" &&
    "contacts" in navigator &&
    !!(navigator as any).contacts?.select &&
    window.isSecureContext
  );
}

export async function pickContact(): Promise<ContactInfo | null> {
  // Check if Contact Picker API is supported
  if (!("contacts" in navigator)) {
    throw new Error(
      "Contact Picker API is not supported on this device. Please use Chrome, Edge, or Samsung Internet to import contacts. You can also manually enter contact information."
    );
  }

  try {
    const contacts = await (navigator as any).contacts.select(
      ["name", "tel", "address"],
      { multiple: false }
    );

    if (!contacts || contacts.length === 0) {
      return null;
    }

    const contact = contacts[0];
    
    return {
      name: contact.name?.[0] || "",
      phone: contact.tel?.[0] || "",
      address: contact.address?.[0] || "",
    };
  } catch (error: any) {
    if (error.name === "AbortError") {
      // User cancelled the contact picker
      return null;
    }
    throw error;
  }
}
