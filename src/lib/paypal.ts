import { Client, Environment, OrdersController, OrderRequest, CheckoutPaymentIntent, AmountWithBreakdown, OrderApplicationContextShippingPreference, OrderApplicationContextUserAction } from '@paypal/paypal-server-sdk';

/**
 * PayPal Client
 * Handles order creation and capture for PayPal payments using PayPal Server SDK v2.2.0
 */

interface CreateOrderParams {
  amount: string;
  currency: string;
  description: string;
  orderId: string;
  returnUrl: string;
  cancelUrl: string;
}

interface PayPalOrder {
  id: string;
  status: string;
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export class PayPalClient {
  private client: Client;
  private ordersController: OrdersController;

  constructor() {
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
    const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // Initialize PayPal Client with proper credentials
    this.client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      timeout: 0,
      environment: environment === 'production' ? Environment.Production : Environment.Sandbox,
    });

    this.ordersController = new OrdersController(this.client);
  }

  /**
   * Create a PayPal order
   */
  async createOrder(params: CreateOrderParams): Promise<PayPalOrder> {
    try {
      const orderRequest: OrderRequest = {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            referenceId: params.orderId,
            description: params.description,
            amount: {
              currencyCode: params.currency,
              value: params.amount,
            } as AmountWithBreakdown,
          },
        ],
        applicationContext: {
          returnUrl: params.returnUrl,
          cancelUrl: params.cancelUrl,
          shippingPreference: OrderApplicationContextShippingPreference.NoShipping,
          userAction: OrderApplicationContextUserAction.PayNow,
          brandName: 'Panda Patches',
        },
      };

      const { result } = await this.ordersController.createOrder({
        body: orderRequest,
      });

      return result as PayPalOrder;
    } catch (error) {
      console.error('PayPal create order error:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  /**
   * Capture a PayPal order
   */
  async captureOrder(orderId: string): Promise<any> {
    try {
      const { result } = await this.ordersController.captureOrder({
        id: orderId,
        prefer: 'return=representation',
      });

      return result;
    } catch (error) {
      console.error('PayPal capture order error:', error);
      throw new Error('Failed to capture PayPal order');
    }
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const { result } = await this.ordersController.getOrder({
        id: orderId,
      });

      return result;
    } catch (error) {
      console.error('PayPal get order error:', error);
      throw new Error('Failed to get PayPal order details');
    }
  }
}
