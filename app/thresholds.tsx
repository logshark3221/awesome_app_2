import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useScreen } from '@/hooks/use-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ThresholdScreen() {
  const { windowWidth, windowHeight } = useScreen();
  const styles = createStyles(windowWidth, windowHeight);

  const [H2SThreshold, onChangeH2S] = React.useState('-1');
  const [O2Threshold, onChangeO2] = React.useState('-1');
  const [COThreshold, onChangeCO] = React.useState('-1');
  const [CH4Threshold, onChangeCH4] = React.useState('-1');
  const [TemperatureThreshold, onChangeTemperature] = React.useState('-1');

  // Testing persistent data storage with async storage
  const readThresholds = async (key: string, updateFunction: (arg0: string) => void) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        updateFunction(value);
      }

      else {
        updateFunction('');
      }
    } catch(e) { }
  }

  const storeThresholds = async (updateFunction: (arg0: string) => void, key:string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      updateFunction(value);
    } catch(e) { }
  }

  // Reads thresholds
  React.useEffect(() => {
    readThresholds('H2SThreshold', onChangeH2S)
    readThresholds('O2Threshold', onChangeO2)
    readThresholds('COThreshold', onChangeCO)
    readThresholds('CH4Threshold', onChangeCH4)
    readThresholds('TemperatureThreshold', onChangeTemperature)
  }, []);
  
  return (
    <KeyboardAvoidingView
      style={{flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>
        <ThemedText>H₂S</ThemedText>
          <TextInput
            style={styles.input}
            onChangeText={(text) => storeThresholds(onChangeH2S, 'H2SThreshold', text)}
            value={H2SThreshold}
            placeholder="100.00"
            keyboardType="numeric"
        />

        <ThemedText>O₂</ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={(text) => storeThresholds(onChangeO2, 'O2Threshold', text)}
          value={O2Threshold}
          placeholder="235000.00"
          keyboardType="numeric"
        />

        <ThemedText>CO</ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={(text) => storeThresholds(onChangeCO, 'COThreshold', text)}
          value={COThreshold}
          placeholder="100.00"
          keyboardType="numeric"
        />

        <ThemedText>CH₄</ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={(text) => storeThresholds(onChangeCH4, 'CH4Threshold', text)}
          value={CH4Threshold}
          placeholder="5000.00"
          keyboardType="numeric"
        />

        <ThemedText>Temperature</ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={(text) => storeThresholds(onChangeTemperature, 'TemperatureThreshold', text)}
          value={TemperatureThreshold}
          placeholder="95.00"
          keyboardType="numeric"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (windowWidth: number, windowHeight: number) => StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },

  content: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#D3D3D3',
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
