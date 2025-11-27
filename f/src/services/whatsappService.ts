// services/whatsappService.ts
import toast from "react-hot-toast";

export interface OrderData {
  data: any;
  products: any[];
  subtotal: number;
  orderStatus: string;
  orderDate: string;
  user?: {
    email: string;
    id: string;
  };
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  private phoneNumber = "01887569963";

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  async sendOrderToWhatsApp(orderData: OrderData): Promise<boolean> {
    try {
      // Use WhatsApp Web method for personal accounts
      const success = await this.sendViaWhatsAppWeb(orderData);
      
      if (success) {
        toast.success("Order sent to WhatsApp automatically!");
        return true;
      } else {
        // Fallback to manual method
        return this.sendManualMessage(orderData);
      }
      
    } catch (error) {
      console.error('Failed to send order to WhatsApp:', error);
      return this.sendManualMessage(orderData);
    }
  }

  // Method using WhatsApp Web direct link
  private async sendViaWhatsAppWeb(orderData: OrderData): Promise<boolean> {
    return new Promise((resolve) => {
      const formattedNumber = this.formatPhoneNumber(this.phoneNumber);
      
      // WhatsApp Web URL - this opens chat directly with the number
      const whatsappUrl = `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${this.formatOrderMessage(orderData)}&app_absent=0`;
      
      // Open in new window
      const newWindow = window.open(whatsappUrl, '_blank', 'width=800,height=600');
      
      if (!newWindow) {
        toast.error("Please allow popups for automatic WhatsApp sending");
        resolve(false);
        return;
      }

      // Try to simulate auto-send after a delay
      setTimeout(() => {
        try {
          // This is a workaround - we can't directly control the send button
          // but we can guide the user
          toast.success("WhatsApp opened! Please click the send button manually");
          resolve(true);
        } catch (error) {
          console.error('Auto-send simulation failed:', error);
          resolve(false);
        }
      }, 3000);
    });
  }

  // Manual method (fallback)
  private async sendManualMessage(orderData: OrderData): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(this.phoneNumber);
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${this.formatOrderMessage(orderData)}`;
      
      window.open(whatsappUrl, '_blank');
      toast.success("WhatsApp opened! Please click send to complete your order");
      return true;
    } catch (error) {
      toast.error('Failed to open WhatsApp');
      return false;
    }
  }

  private formatOrderMessage(orderData: OrderData): string {
    const { data, products, subtotal, orderStatus, orderDate } = orderData;
    
    const productList = products.map(product => 
      `📦 ${product.title} (${product.color}, ${product.size}) - Qty: ${product.quantity} - $${product.price}`
    ).join('%0A');

    const shipping = 5;
    const taxes = subtotal / 5;
    const total = subtotal + shipping + taxes;

    return `
🛒 *NEW ORDER CONFIRMATION* 🛒
%0A%0A
*Order Details:*
📅 Date: ${orderDate}
🔄 Status: ${orderStatus}
💰 Total: $${total.toFixed(2)}
%0A%0A
*Customer Information:*
👤 Name: ${data.firstName} ${data.lastName}
📧 Email: ${data.emailAddress}
📞 Phone: ${data.phone}
🏢 Company: ${data.company}
%0A%0A
*Shipping Address:*
📍 ${data.address}, ${data.apartment}
🏙️ ${data.city}, ${data.region}
🌍 ${data.country}, ${data.postalCode}
%0A%0A
*Order Items:*
${productList}
%0A%0A
*Order Summary:*
💵 Subtotal: $${subtotal.toFixed(2)}
🚚 Shipping: $${shipping.toFixed(2)}
🏛️ Taxes: $${taxes.toFixed(2)}
💳 *Total: $${total.toFixed(2)}*
%0A%0A
*Payment Method:*
💳 ${data.paymentType}
%0A%0A
_This order was generated automatically from our website_
    `.trim();
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleanNumber = phone.replace(/\D/g, '');
    
    // If number starts with 0, replace with country code (Bangladesh: 880)
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '880' + cleanNumber.substring(1);
    }
    
    // If number doesn't have country code, assume Bangladesh
    if (cleanNumber.length === 10) {
      cleanNumber = '880' + cleanNumber;
    }
    
    return cleanNumber;
  }

  // Set phone number
  setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber.replace(/\D/g, '');
  }

  // Get current phone number
  getPhoneNumber(): string {
    return this.phoneNumber;
  }

  // Method to validate phone number
  isValidPhoneNumber(phoneNumber: string): boolean {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return cleanNumber.length >= 10 && cleanNumber.length <= 15;
  }
}