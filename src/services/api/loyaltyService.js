import { supabase } from '../../config/supabase';

/**
 * Loyalty Service
 * Handles all loyalty and rewards-related API calls
 */

export const loyaltyService = {
  /**
   * Get user's loyalty account for a location
   */
  async getLoyaltyAccount(userId, locationId) {
    try {
      const { data, error } = await supabase
        .from('loyalty_accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('location_id', locationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error

      // Create account if it doesn't exist
      if (!data) {
        return await this.createLoyaltyAccount(userId, locationId);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Create loyalty account
   */
  async createLoyaltyAccount(userId, locationId) {
    try {
      const { data, error } = await supabase
        .from('loyalty_accounts')
        .insert({
          user_id: userId,
          location_id: locationId,
          points_balance: 0,
          lifetime_spend: 0,
          punch_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get loyalty transactions
   */
  async getLoyaltyTransactions(loyaltyAccountId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*, orders(order_number, total)')
        .eq('loyalty_account_id', loyaltyAccountId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Add loyalty transaction
   */
  async addLoyaltyTransaction(loyaltyAccountId, transactionData) {
    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .insert({
          loyalty_account_id: loyaltyAccountId,
          ...transactionData,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Update loyalty points
   */
  async updateLoyaltyPoints(loyaltyAccountId, pointsChange) {
    try {
      // Get current balance
      const { data: account, error: fetchError } = await supabase
        .from('loyalty_accounts')
        .select('points_balance')
        .eq('id', loyaltyAccountId)
        .single();

      if (fetchError) throw fetchError;

      const newBalance = account.points_balance + pointsChange;

      // Update balance
      const { data, error } = await supabase
        .from('loyalty_accounts')
        .update({ points_balance: newBalance })
        .eq('id', loyaltyAccountId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get available rewards for a location
   */
  async getRewards(locationId) {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*, menu_items(name, image_url)')
        .eq('location_id', locationId)
        .eq('is_active', true)
        .order('points_cost');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Redeem reward
   */
  async redeemReward(loyaltyAccountId, rewardId, pointsCost) {
    try {
      // Deduct points
      const { data, error } = await this.updateLoyaltyPoints(
        loyaltyAccountId,
        -pointsCost
      );

      if (error) throw error;

      // Log transaction
      await this.addLoyaltyTransaction(loyaltyAccountId, {
        transaction_type: 'redeemed',
        points_change: -pointsCost,
        description: `Redeemed reward: ${rewardId}`,
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Calculate points earned for order
   */
  calculatePointsEarned(orderTotal, pointsPerDollar = 1.0) {
    return Math.floor(orderTotal * pointsPerDollar);
  },

  /**
   * Get loyalty program for location
   */
  async getLoyaltyProgram(locationId) {
    try {
      const { data, error } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('location_id', locationId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

export default loyaltyService;
