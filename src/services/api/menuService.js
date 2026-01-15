import { supabase } from '../../config/supabase';

/**
 * Menu Service
 * Handles all menu-related API calls
 */

export const menuService = {
  /**
   * Get all menu categories for a location
   */
  async getCategories(locationId) {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*, menu_id, menus!inner(location_id)')
        .eq('menus.location_id', locationId)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get all menu items for a category
   */
  async getItemsByCategory(categoryId) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*, menu_item_modifiers(*)')
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('sort_order');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get all menu items for a location
   */
  async getMenuItems(locationId) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_item_modifiers(*),
          menu_categories!inner(
            menu_id,
            menus!inner(location_id)
          )
        `)
        .eq('menu_categories.menus.location_id', locationId)
        .eq('is_available', true)
        .order('sort_order');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get a single menu item with modifiers
   */
  async getMenuItem(itemId) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*, menu_item_modifiers(*)')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Search menu items
   */
  async searchMenuItems(locationId, query) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories!inner(
            menu_id,
            menus!inner(location_id)
          )
        `)
        .eq('menu_categories.menus.location_id', locationId)
        .eq('is_available', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

export default menuService;
