import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useScreen } from '@/hooks/use-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ThresholdScreen() {
  const { windowWidth, windowHeight } = useScreen();
  const styles = createStyles(windowWidth, windowHeight);

  const [thresholds, setThresholds] = React.useState({
    H2SLower: '',
    H2SUpper: '',
    O2Lower: '',
    O2Upper: '',
    COLower: '',
    COUpper: '',
    CH4Lower: '',
    CH4Upper: '',
    TempLower: '',
    TempUpper: '',
  });

  const loadThresholds = async () => {
    const keys = Object.keys(thresholds);
    const updated: any = {};

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      updated[key] = value ?? '';
    }
    setThresholds(updated);
  };

  const updateThreshold = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
    setThresholds(prev => ({ ...prev, [key]: value }));
  };

  React.useEffect(() => {
    loadThresholds();
  }, []);
  
  return (
    <KeyboardAvoidingView
      style={{flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>
        <ThemedText darkColor='black' lightColor='black'>H₂S</ThemedText>
          <View style={styles.row}>
            <TextInput
              style={styles.halfInput}
              placeholder="0.00"
              value={thresholds.H2SLower}
              onChangeText={(text) => updateThreshold('H2SLower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="10.00"
              value={thresholds.H2SUpper}
              onChangeText={(text) => updateThreshold('H2SUpper', text)}
              keyboardType="numeric"
            />
          </View>

        <ThemedText darkColor='black' lightColor='black'>O₂</ThemedText>
          <View style={styles.row}>
            <TextInput
              style={styles.halfInput}
              placeholder="19.50"
              value={thresholds.O2Lower}
              onChangeText={(text) => updateThreshold('O2Lower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="23.50"
              value={thresholds.O2Upper}
              onChangeText={(text) => updateThreshold('O2Upper', text)}
              keyboardType="numeric"
            />
          </View>

        <ThemedText darkColor='black' lightColor='black'>CO</ThemedText>
          <View style={styles.row}>
            <TextInput
              style={styles.halfInput}
              placeholder="0.00"
              value={thresholds.COLower}
              onChangeText={(text) => updateThreshold('COLower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="50.00"
              value={thresholds.COUpper}
              onChangeText={(text) => updateThreshold('COUpper', text)}
              keyboardType="numeric"
            />
          </View>

        <ThemedText darkColor='black' lightColor='black'>CH₄</ThemedText>
          <View style={styles.row}>
            <TextInput
              style={styles.halfInput}
              placeholder="0.00"
              value={thresholds.CH4Lower}
              onChangeText={(text) => updateThreshold('CH4Lower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="5.00"
              value={thresholds.CH4Upper}
              onChangeText={(text) => updateThreshold('CH4Upper', text)}
              keyboardType="numeric"
            />
          </View>

        <ThemedText darkColor='black' lightColor='black'>Temperature</ThemedText>
          <View style={styles.row}>
            <TextInput 
              style={styles.halfInput}
              placeholder="32.00"
              value={thresholds.TempLower}
              onChangeText={(text) => updateThreshold('TempLower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="95.00"
              value={thresholds.TempUpper}
              onChangeText={(text) => updateThreshold('TempUpper', text)}
              keyboardType="numeric"
            />
          </View>
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

  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },

  halfInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 6,
  },
});
