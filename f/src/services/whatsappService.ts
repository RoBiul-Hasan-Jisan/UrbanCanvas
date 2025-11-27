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
      const message = this.formatOrderMessage(orderData);
      const whatsappUrl = this.generateWhatsAppUrl(message);
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      toast.success("Order ready to share on WhatsApp");
      return true;
      
    } catch (error) {
      console.error('Failed to send order to WhatsApp:', error);
      toast.error('Failed to send order to WhatsApp');
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
_This order was generated automatically_
    `.trim();
  }

  private generateWhatsAppUrl(message: string): string {
    // Format: https://wa.me/PHONE_NUMBER?text=YOUR_MESSAGE
    return `https://wa.me/${this.phoneNumber}?text=${message}`;
  }

  // Alternative method for multiple numbers
  sendToMultipleNumbers(orderData: OrderData, numbers: string[]): void {
    const message = this.formatOrderMessage(orderData);
    
    numbers.forEach(phoneNumber => {
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Method to send with file attachment (if needed)
  async sendWithAttachment(orderData: OrderData): Promise<void> {
    const message = this.formatOrderMessage(orderData);
    const url = `https://wa.me/${this.phoneNumber}?text=${message}`;
    
    // Note: File attachments in WhatsApp Web have limitations
    // This would typically work better with the WhatsApp Business API
    window.open(url, '_blank');
  }

  // Method to update the phone number dynamically
  setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
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