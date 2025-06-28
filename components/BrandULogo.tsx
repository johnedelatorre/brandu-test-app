import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BrandULogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function BrandULogo({ size = 'medium', color = '#000000' }: BrandULogoProps) {
  const logoStyles = [
    styles.logo,
    styles[size],
    { color }
  ];

  return (
    <View style={styles.container}>
      <Text style={logoStyles}>
        Brand<Text style={[logoStyles, styles.accent]}>U</Text>
      </Text>
      <View style={[styles.underline, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'PlayfairDisplay-Bold',
    letterSpacing: -1,
    textAlign: 'center',
  },
  small: {
    fontSize: 24,
  },
  medium: {
    fontSize: 48,
  },
  large: {
    fontSize: 64,
  },
  accent: {
    fontStyle: 'italic',
  },
  underline: {
    height: 2,
    width: 40,
    marginTop: 8,
    borderRadius: 1,
  },
});