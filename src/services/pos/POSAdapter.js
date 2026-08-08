/**
 * POS Adapter Interface
 * Abstract base class for POS integrations
 *
 * This ensures all POS integrations (Lightspeed, Clover, etc.)
 * implement the same interface for plug-and-play functionality
 */

export class POSAdapter {
  constructor(config) {
    this.config = config;
  }

  /**
   * Sync menu from POS
   * @returns {Promise<{categories, items, modifiers}>}
   */
  async syncMenu() {
    throw new Error('syncMenu() must be implemented by subclass');
  }

  /**
   * Push order to POS
   * @param {Object} order - Order object
   * @returns {Promise<{posOrderId, success}>}
   */
  async pushOrder(order) {
    throw new Error('pushOrder() must be implemented by subclass');
  }

  /**
   * Update item availability (86'd items)
   * @param {string} itemId - Menu item ID
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise<boolean>}
   */
  async updateItemAvailability(itemId, isAvailable) {
    throw new Error('updateItemAvailability() must be implemented by subclass');
  }

  /**
   * Get order status from POS
   * @param {string} posOrderId - POS order ID
   * @returns {Promise<{status, details}>}
   */
  async getOrderStatus(posOrderId) {
    throw new Error('getOrderStatus() must be implemented by subclass');
  }

  /**
   * Test connection to POS
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    throw new Error('testConnection() must be implemented by subclass');
  }
}

export default POSAdapter;
