import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function CartScreen() {
  const { t } = useTranslation();
  const { cart } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('cart.cart')}</Text>
      <View style={styles.content}>
        <Text style={styles.placeholder}>
          {cart.length === 0
            ? t('cart.emptyCart')
            : `${cart.length} ${t('cart.itemsInCart', { count: cart.length })}`}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textSecondary,
  },
});
