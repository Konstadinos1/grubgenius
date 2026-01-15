import axios from 'axios';
import { POSAdapter } from './POSAdapter';

/**
 * Clover POS Adapter
 * Implements POS integration for Clover
 */

export class CloverAdapter extends POSAdapter {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.merchantId = config.merchantId;
    this.baseUrl = config.baseUrl || 'https://api.clover.com/v3';
  }

  /**
   * Sync menu from Clover
   */
  async syncMenu() {
    try {
      // Fetch categories
      const categoriesResponse = await this.makeRequest(
        `/merchants/${this.merchantId}/categories`
      );

      // Fetch items
      const itemsResponse = await this.makeRequest(
        `/merchants/${this.merchantId}/items?expand=modifierGroups`
      );

      // Transform to our schema
      const categories = this.transformCategories(
        categoriesResponse.data.elements
      );
      const items = this.transformItems(itemsResponse.data.elements);
      const modifiers = this.extractModifiers(itemsResponse.data.elements);

      return {
        categories,
        items,
        modifiers,
        success: true,
      };
    } catch (error) {
      console.error('Clover menu sync error:', error);
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
   * Push order to Clover
   */
  async pushOrder(order) {
    try {
      const cloverOrder = this.transformOrderToClover(order);

      const response = await this.makeRequest(
        `/merchants/${this.merchantId}/orders`,
        'POST',
        cloverOrder
      );

      // Add line items
      for (const item of order.order_items) {
        await this.makeRequest(
          `/merchants/${this.merchantId}/orders/${response.data.id}/line_items`,
          'POST',
          {
            item: { id: item.pos_item_id },
            name: item.item_name,
            price: Math.round(item.item_price * 100), // Cents
            unitQty: item.quantity,
          }
        );
      }

      return {
        posOrderId: response.data.id,
        success: true,
      };
    } catch (error) {
      console.error('Clover order push error:', error);
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
        `/merchants/${this.merchantId}/items/${itemId}`,
        'POST',
        {
          hidden: !isAvailable,
        }
      );

      return true;
    } catch (error) {
      console.error('Clover availability update error:', error);
      return false;
    }
  }

  /**
   * Get order status
   */
  async getOrderStatus(posOrderId) {
    try {
      const response = await this.makeRequest(
        `/merchants/${this.merchantId}/orders/${posOrderId}`
      );

      return {
        status: this.mapCloverStatus(response.data.state),
        details: response.data,
      };
    } catch (error) {
      console.error('Clover status check error:', error);
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
      await this.makeRequest(`/merchants/${this.merchantId}`);
      return true;
    } catch (error) {
      console.error('Clover connection test failed:', error);
      return false;
    }
  }

  /**
   * Make authenticated request to Clover API
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
   * Transform Clover categories to our schema
   */
  transformCategories(cloverCategories) {
    return cloverCategories.map((cat) => ({
      pos_category_id: cat.id,
      name: cat.name,
      description: '',
      sort_order: cat.sortOrder || 0,
    }));
  }

  /**
   * Transform Clover items to our schema
   */
  transformItems(cloverItems) {
    return cloverItems.map((item) => ({
      pos_item_id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price ? item.price / 100 : 0, // Convert from cents
      is_available: !item.hidden,
      image_url: item.image?.url || null,
    }));
  }

  /**
   * Extract modifiers from Clover items
   */
  extractModifiers(cloverItems) {
    const modifiers = [];

    cloverItems.forEach((item) => {
      if (item.modifierGroups && item.modifierGroups.elements) {
        item.modifierGroups.elements.forEach((group) => {
          if (group.modifiers && group.modifiers.elements) {
            group.modifiers.elements.forEach((mod) => {
              modifiers.push({
                pos_modifier_id: mod.id,
                name: mod.name,
                group_name: group.name,
                price_adjustment: mod.price ? mod.price / 100 : 0,
                is_required: group.minRequired > 0,
              });
            });
          }
        });
      }
    });

    return modifiers;
  }

  /**
   * Transform our order to Clover format
   */
  transformOrderToClover(order) {
    return {
      state: 'open',
      total: Math.round(order.total * 100), // Convert to cents
      currency: 'CAD',
      orderType: {
        id: this.getCloverOrderTypeId(order.order_type),
      },
      note: order.special_instructions || '',
    };
  }

  /**
   * Get Clover order type ID
   */
  getCloverOrderTypeId(orderType) {
    // These IDs should be configured per merchant
    const typeMap = {
      'pickup': 'PICKUP_ID',
      'delivery': 'DELIVERY_ID',
      'dine_in': 'DINE_IN_ID',
    };

    return typeMap[orderType] || 'PICKUP_ID';
  }

  /**
   * Map Clover status to our status
   */
  mapCloverStatus(cloverStatus) {
    const statusMap = {
      'open': 'pending',
      'locked': 'confirmed',
      'paid': 'preparing',
      'fulfilled': 'completed',
      'canceled': 'cancelled',
    };

    return statusMap[cloverStatus] || 'unknown';
  }
}

export default CloverAdapter;
