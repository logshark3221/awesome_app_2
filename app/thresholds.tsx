import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useScreen } from '@/hooks/use-screen';
import { Ionicons } from '@expo/vector-icons';

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

  // Loads thresholds from async storage
  const loadThresholds = async () => {
    const keys = Object.keys(thresholds);
    const updated: any = {};

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      updated[key] = value ?? '';
    }
    setThresholds(updated);
  };

  // Updates thresholds to async storage
  const updateThreshold = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
    setThresholds(prev => ({ ...prev, [key]: value }));
  };

  // Resets thresholds to OSHA standards
  const resetThresholds = async() => {
    const keys = ["H2SLower", "H2SUpper", "O2Lower", "O2Upper", "COLower", "COUpper", "CH4Lower", "CH4Upper", "TempLower", "TempUpper"]
    const values = [0.00, 10.00, 19.50, 23.50, 0.00, 50.00, 0.00, 5.00, 32.00, 95.00]

    for (let i = 0; i < keys.length; ++i) {
      updateThreshold(keys[i], values[i].toString())

    }
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

          {/* Top Bar */}
          <View style={styles.row}>
            <View style = {[styles.hRectangle, { flex: 0.2, backgroundColor: '#9D2235'},]}>
            <ThemedText darkColor='white' lightColor='white'> Sensor </ThemedText>
            </View>
            
            <View style = {[styles.hRectangle, { flex: 0.4, backgroundColor: '#9D2235'},]}>
            <ThemedText darkColor='white' lightColor='white'> Lower Bound </ThemedText>
            </View>

            <View style = {[styles.hRectangle, { flex: 0.4, backgroundColor: '#9D2235'},]}>
            <ThemedText darkColor='white' lightColor='white'> Upper Bound </ThemedText>
            </View>
          </View>

          {/* H2S */}
          <View style={styles.row}>
            <View style = {[styles.hRectangle, { flex: 0.56},]}>
            <ThemedText darkColor='black' lightColor='black'>H₂S</ThemedText>
            </View>
            
            <TextInput
              style={styles.halfInput}
              placeholder="0.00"
              placeholderTextColor={"gray"}
              value={thresholds.H2SLower}
              onChangeText={(text) => updateThreshold('H2SLower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="10.00"
              placeholderTextColor={"gray"}
              value={thresholds.H2SUpper}
              onChangeText={(text) => updateThreshold('H2SUpper', text)}
              keyboardType="numeric"
            />
          </View>

          {/* O2 */}
          <View style={styles.row}>
            <View style = {[styles.hRectangle, { flex: 0.56},]}>
            <ThemedText darkColor='black' lightColor='black'>O₂</ThemedText>
            </View>

            <TextInput
              style={styles.halfInput}
              placeholder="19.50"
              placeholderTextColor={"gray"}
              value={thresholds.O2Lower}
              onChangeText={(text) => updateThreshold('O2Lower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="23.50"
              placeholderTextColor={"gray"}
              value={thresholds.O2Upper}
              onChangeText={(text) => updateThreshold('O2Upper', text)}
              keyboardType="numeric"
            />
          </View>
        
          {/* CO */}
          <View style={styles.row}>
            <View style = {[styles.hRectangle, { flex: 0.56},]}>
            <ThemedText darkColor='black' lightColor='black'>CO</ThemedText>
            </View>

            <TextInput
              style={styles.halfInput}
              placeholder="0.00"
              placeholderTextColor={"gray"}
              value={thresholds.COLower}
              onChangeText={(text) => updateThreshold('COLower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="50.00"
              placeholderTextColor={"gray"}
              value={thresholds.COUpper}
              onChangeText={(text) => updateThreshold('COUpper', text)}
              keyboardType="numeric"
            />
          </View>
        
          {/* CH4 */}
          <View style={styles.row}>
            <View style = {[styles.hRectangle, { flex: 0.56},]}>
            <ThemedText darkColor='black' lightColor='black'>CH₄</ThemedText>
            </View>

            <TextInput
              style={styles.halfInput}
              placeholder="0.00"
              placeholderTextColor={"gray"}
              value={thresholds.CH4Lower}
              onChangeText={(text) => updateThreshold('CH4Lower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="5.00"
              placeholderTextColor={"gray"}
              value={thresholds.CH4Upper}
              onChangeText={(text) => updateThreshold('CH4Upper', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Temperature */}
          <View style={styles.row}>
            <View style = {[styles.hRectangle, { flex: 0.56},]}>
            <Ionicons name='thermometer-outline' size={22} color= 'black'/>
            </View>

            <TextInput 
              style={styles.halfInput}
              placeholder="32.00"
              placeholderTextColor={"gray"}
              value={thresholds.TempLower}
              onChangeText={(text) => updateThreshold('TempLower', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="95.00"
              placeholderTextColor={"gray"}
              value={thresholds.TempUpper}
              onChangeText={(text) => updateThreshold('TempUpper', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Reset Button */}
          <View>
            <TouchableOpacity
                  style={[styles.resetButton, { backgroundColor: '#9D2235',},]}
                  onPress={resetThresholds}
            >
              <ThemedText darkColor='white' lightColor='white'>Reset Values to OSHA Standards</ThemedText>
            </TouchableOpacity>
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
    gap: 10,
  },

  halfInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    flex: 1,
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 6,
  },

  hRectangle: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    flex: 0.3,
    height: 40,
    borderWidth: 1,
    padding: 4,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resetButton: {
    // bottom: windowHeight * 0.05,
    alignSelf: 'center',
    width: windowWidth * 0.6,
    height: windowHeight * 0.07,
    borderRadius: 15,
    padding: 4,
    margin: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
