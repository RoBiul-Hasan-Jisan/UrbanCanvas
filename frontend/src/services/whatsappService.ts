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
  private phoneNumber = "+880 1843-426422"; 

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  async sendOrderToWhatsApp(orderData: OrderData): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(orderData);
      return await this.sendManualMessage(message);
    } catch (error) {
      console.error('Failed to send order to WhatsApp:', error);
      return this.sendManualMessage(this.formatOrderMessage(orderData));
    }
  }

  // Simple manual method that works reliably
  private async sendManualMessage(formattedMessage: string): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(this.phoneNumber);
      const encodedMessage = encodeURIComponent(formattedMessage);
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      toast.success("WhatsApp opened! Please click send to share order details");
      return true;
    } catch (error) {
      console.error('Failed to open WhatsApp:', error);
      toast.error('Failed to open WhatsApp automatically. Please manually share the order details.');
      return false;
    }
  }

  private formatOrderMessage(orderData: OrderData): string {
    const { data, products, subtotal } = orderData;
    
    // Calculate totals
    const shipping = 5;
    const taxes = subtotal / 5;
    const total = subtotal + shipping + taxes;

    // Format product list
    const productList = products.map((product, index) => 
      `${index + 1}. ${product.title}\n   Color: ${product.color} | Size: ${product.size}\n   Price: $${product.price} x ${product.quantity} = $${(product.price * product.quantity).toFixed(2)}`
    ).join('\n\n');

    // Get user email from localStorage if available
    const userEmail = orderData.user?.email || JSON.parse(localStorage.getItem("user") || "{}").email || "Not provided";

    // Format the message - using actual form field names from your checkout
    const message = `
 *NEW ORDER RECEIVED* 

*Customer Details:*
 Name: ${data.firstName} ${data.lastName}
 Phone: ${data.phone}
 Email: ${userEmail}

*Shipping Address:*
 ${data.address}
 ${data.city}, ${data.region}
 ${data.country} - ${data.postalCode}

*Order Items:*
${productList}

*Payment Information:*
 Method: ${data.paymentType}
${data.paymentType === 'bikash' && data.bikashNumber ? `📱 Bikash Number: ${data.bikashNumber}` : ''}
${data.paymentType === 'credit-card' && data.nameOnCard ? `💳 Card Holder: ${data.nameOnCard}` : ''}

*Order Summary:*
 Subtotal: $${subtotal.toFixed(2)}
 Shipping: $${shipping.toFixed(2)}
 Taxes: $${taxes.toFixed(2)}
 *Total: $${total.toFixed(2)}*

*Order Meta:*
 Order Date: ${new Date().toLocaleString()}
 Order ID: #${Date.now().toString().slice(-8)}

_Thank you for your order!_
    `.trim();

    return message;
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters except +
    let cleanNumber = phone.replace(/[^\d+]/g, '');
    
    // If it's a Bangladeshi number without country code
    if (cleanNumber.startsWith('01') && cleanNumber.length === 11) {
      cleanNumber = '880' + cleanNumber.substring(1);
    }
    // If it starts with 0 but not 01
    else if (cleanNumber.startsWith('0') && !cleanNumber.startsWith('01')) {
      cleanNumber = '880' + cleanNumber.substring(1);
    }
    // If it doesn't have country code and is 10 digits
    else if (cleanNumber.length === 10 && !cleanNumber.startsWith('+')) {
      cleanNumber = '880' + cleanNumber;
    }
    
    // Remove any + signs for WhatsApp URL
    cleanNumber = cleanNumber.replace('+', '');
    
    return cleanNumber;
  }

  // Set phone number
  setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
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