import { LightspeedAdapter } from './LightspeedAdapter';
import { CloverAdapter } from './CloverAdapter';

/**
 * POS Factory
 * Creates appropriate POS adapter based on type
 */

export class POSFactory {
  /**
   * Create POS adapter instance
   * @param {string} posType - Type of POS ('lightspeed', 'clover')
   * @param {Object} config - POS configuration
   * @returns {POSAdapter}
   */
  static create(posType, config) {
    switch (posType.toLowerCase()) {
      case 'lightspeed':
        return new LightspeedAdapter(config);

      case 'clover':
        return new CloverAdapter(config);

      default:
        throw new Error(`Unsupported POS type: ${posType}`);
    }
  }

  /**
   * Get POS adapter for location
   * @param {Object} location - Location object from database
   * @returns {POSAdapter}
   */
  static createForLocation(location) {
    if (!location.pos_type) {
      throw new Error('Location does not have POS configured');
    }

    if (!location.pos_config) {
      throw new Error('Location does not have POS configuration');
    }

    return this.create(location.pos_type, location.pos_config);
  }
}

export default POSFactory;
