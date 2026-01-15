import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      t('common.logout'),
      'Are you sure you want to sign out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.logout'),
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert(t('common.error'), error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.profile')}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('profile.personalInfo')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('profile.addresses')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('profile.paymentMethods')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('profile.preferences')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>{t('common.logout')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  email: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.xl,
  },
  menuItem: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  menuItemText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text,
  },
  signOutButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.error,
  },
  signOutText: {
    fontSize: Typography.fontSizes.md,
    color: '#fff',
    fontWeight: Typography.fontWeights.semibold,
  },
});
