import axios from 'axios';
import { POSAdapter } from './POSAdapter';

/**
 * Lightspeed Restaurant POS Adapter
 * Implements POS integration for Lightspeed Restaurant
 */

export class LightspeedAdapter extends POSAdapter {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.baseUrl || 'https://api.lightspeedapp.com/API/V3';
    this.accountId = config.accountId;
  }

  /**
   * Sync menu from Lightspeed
   */
  async syncMenu() {
    try {
      // Fetch categories
      const categoriesResponse = await this.makeRequest(
        `/Account/${this.accountId}/Category`
      );

      // Fetch items
      const itemsResponse = await this.makeRequest(
        `/Account/${this.accountId}/Item`
      );

      // Fetch modifiers
      const modifiersResponse = await this.makeRequest(
        `/Account/${this.accountId}/ItemMatrix`
      );

      // Transform to our schema
      const categories = this.transformCategories(categoriesResponse.data);
      const items = this.transformItems(itemsResponse.data);
      const modifiers = this.transformModifiers(modifiersResponse.data);

      return {
        categories,
        items,
        modifiers,
        success: true,
      };
    } catch (error) {
      console.error('Lightspeed menu sync error:', error);
      return {
        categories: [],
        items: [],
        modifiers: [],
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Push order to Lightspeed
   */
  async pushOrder(order) {
    try {
      const lightspeedOrder = this.transformOrderToLightspeed(order);

      const response = await this.makeRequest(
        `/Account/${this.accountId}/Sale`,
        'POST',
        lightspeedOrder
      );

      return {
        posOrderId: response.data.saleID,
        success: true,
      };
    } catch (error) {
      console.error('Lightspeed order push error:', error);
      return {
        posOrderId: null,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update item availability
   */
  async updateItemAvailability(itemId, isAvailable) {
    try {
      await this.makeRequest(
        `/Account/${this.accountId}/Item/${itemId}`,
        'PUT',
        {
          archived: !isAvailable,
        }
      );

      return true;
    } catch (error) {
      console.error('Lightspeed availability update error:', error);
      return false;
    }
  }

  /**
   * Get order status
   */
  async getOrderStatus(posOrderId) {
    try {
      const response = await this.makeRequest(
        `/Account/${this.accountId}/Sale/${posOrderId}`
      );

      return {
        status: this.mapLightspeedStatus(response.data.saleStatus),
        details: response.data,
      };
    } catch (error) {
      console.error('Lightspeed status check error:', error);
      return {
        status: 'unknown',
        details: null,
        error: error.message,
      };
    }
  }

  /**
   * Test connection
   */
  async testConnection() {
    try {
      await this.makeRequest(`/Account/${this.accountId}`);
      return true;
    } catch (error) {
      console.error('Lightspeed connection test failed:', error);
      return false;
    }
  }

  /**
   * Make authenticated request to Lightspeed API
   */
  async makeRequest(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response;
  }

  /**
   * Transform Lightspeed categories to our schema
   */
  transformCategories(lightspeedCategories) {
    return lightspeedCategories.map((cat) => ({
      pos_category_id: cat.categoryID,
      name: cat.name,
      description: cat.description || '',
      sort_order: cat.sortOrder || 0,
    }));
  }

  /**
   * Transform Lightspeed items to our schema
   */
  transformItems(lightspeedItems) {
    return lightspeedItems.map((item) => ({
      pos_item_id: item.itemID,
      name: item.description,
      description: item.longDescription || '',
      price: parseFloat(item.Prices?.ItemPrice?.[0]?.amount || 0),
      is_available: !item.archived,
      image_url: item.Images?.Image?.[0]?.baseImageURL || null,
    }));
  }

  /**
   * Transform Lightspeed modifiers to our schema
   */
  transformModifiers(lightspeedModifiers) {
    return lightspeedModifiers.map((mod) => ({
      pos_modifier_id: mod.itemMatrixID,
      name: mod.name,
      price_adjustment: parseFloat(mod.priceAdjustment || 0),
    }));
  }

  /**
   * Transform our order to Lightspeed format
   */
  transformOrderToLightspeed(order) {
    return {
      customerID: order.user_id || 0,
      employeeID: 1, // Default employee
      shopID: 1,
      completed: false,
      SaleLines: {
        SaleLine: order.order_items.map((item) => ({
          itemID: item.pos_item_id,
          unitQuantity: item.quantity,
          unitPrice: item.item_price,
          note: item.special_instructions || '',
        })),
      },
      SalePayments: {
        SalePayment: [
          {
            paymentTypeID: 1, // Online payment
            amount: order.total,
          },
        ],
      },
    };
  }

  /**
   * Map Lightspeed status to our status
   */
  mapLightspeedStatus(lightspeedStatus) {
    const statusMap = {
      'pending': 'pending',
      'completed': 'completed',
      'voided': 'cancelled',
    };

    return statusMap[lightspeedStatus] || 'unknown';
  }
}

export default LightspeedAdapter;
