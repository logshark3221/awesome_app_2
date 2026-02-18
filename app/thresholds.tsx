import React from 'react';
import { Image } from 'expo-image';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useScreen } from '@/hooks/use-screen';

export default function ThresholdScreen() {
  const { windowWidth, windowHeight } = useScreen();
  const styles = createStyles(windowWidth, windowHeight);

  const [H2SThreshold, onChangeH2S] = React.useState('20');
  const [O2Threshold, onChangeO2] = React.useState('20');
  const [COThreshold, onChangeCO] = React.useState('20');
  const [CH4Threshold, onChangeCH4] = React.useState('20');
  const [TemperatureThreshold, onChangeTemperature] = React.useState('20');
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Thresholds
        </ThemedText>
      </ThemedView>

      <ThemedText>H₂S</ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={onChangeH2S}
          value={H2SThreshold}
          placeholder="20.00"
          keyboardType="numeric"
      />

      <ThemedText>O₂</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={onChangeO2}
        value={O2Threshold}
        placeholder="20.00"
        keyboardType="numeric"
      />

      <ThemedText>CO</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={onChangeCO}
        value={COThreshold}
        placeholder="20.00"
        keyboardType="numeric"
      />

      <ThemedText>CH₄</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={onChangeCH4}
        value={CH4Threshold}
        placeholder="20.00"
        keyboardType="numeric"
      />

      <ThemedText>Temperature</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTemperature}
        value={TemperatureThreshold}
        placeholder="20.00"
        keyboardType="numeric"
      />
    </ParallaxScrollView>
  );
}

const createStyles = (windowWidth: number, windowHeight: number) => StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
