import { ThemedText } from '@/components/themed-text';
import { useScreen } from '@/hooks/use-screen';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

const CIRCLE_COUNT = 5;

export default function HomeScreen() {

  const DEFAULT_THRESHOLDS = {
    H2SThreshold: '100.00',
    O2Threshold: '235000.00',
    COThreshold: '100.00',
    CH4Threshold: '5000.00',
    TemperatureThreshold: '95.00',
  };

  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);

  const [readings, setReadings] = useState({
    H2S: 0,
    O2: 0,
    CO: 0,
    CH4: 0,
    Temp: 0,
  });

  useEffect(() => {
    const loadThresholds = async () => {
      const updated = { ...DEFAULT_THRESHOLDS };
      for (const key of Object.keys(DEFAULT_THRESHOLDS)) {
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          updated[key as keyof typeof DEFAULT_THRESHOLDS] = stored;
        }
      }
      setThresholds(updated);
    };
    loadThresholds();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReadings({
        H2S: Math.random() * 200,
        O2: Math.random() * 500000,
        CO: Math.random() * 200,
        CH4: Math.random() * 6000,
        Temp: Math.random() * 150,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (reading: number, threshold: string) => {
    const thresholdNum = parseFloat(threshold);
    return reading > thresholdNum ? 'red' : 'green';
  };

  type Item = 
    | {
      type: 'chemical';
      label: string;
      value: number;
      threshold: string;
      unit: string;
    }
    | {
      type: 'icon';
      name: keyof typeof Ionicons.glyphMap;
      value: number;
      threshold: string;
      unit: string;
    };

  const items: Item[] = [
    {
      type: 'chemical',
      label: 'H₂S',
      value: readings.H2S,
      threshold: thresholds.H2SThreshold,
      unit: 'PPM',
    },
    {
      type: 'chemical',
      label: 'O₂',
      value: readings.O2,
      threshold: thresholds.O2Threshold,
      unit: 'PPM',
    },
    {
      type: 'chemical',
      label: 'CO',
      value: readings.CO,
      threshold: thresholds.COThreshold,
      unit: 'PPM',
    },
    {
      type: 'chemical',
      label: 'CH₄',
      value: readings.CH4,
      threshold: thresholds.CH4Threshold,
      unit: 'PPM',
    },
    {
      type: 'icon',
      name: 'thermometer-outline',
      value: readings.Temp,
      threshold: thresholds.TemperatureThreshold,
      unit: 'F',
    },
  ];

  const { windowWidth, windowHeight } = useScreen();
  const styles = createStyles(windowWidth, windowHeight);

  const TRACK_HEIGHT = windowHeight * 0.5;
  const CIRCLE_SIZE = windowHeight * 0.05;

  const spacing = (TRACK_HEIGHT - CIRCLE_COUNT * CIRCLE_SIZE) / (CIRCLE_COUNT + 1);

  const locations = items.map((item, i) => {
    return {
      id: i,
      top: spacing + i * (CIRCLE_SIZE + spacing),
      ...item,
  };
});

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.trackContainer}>
          <View style={styles.vRectangle} />
          {locations.map(loc => (
            <View key={loc.id} style={{ position: 'absolute',
            top: loc.top,
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center' }}>
              <View style={[styles.circle,
                { backgroundColor: getColor(loc.value, loc.threshold)},
              ]} />
              <View style={[styles.hRectangle, { marginLeft: windowWidth * 0.05 }]}>
                {loc.type === 'chemical' && (
                  <ThemedText style={[styles.rectText,
                    { color: getColor(loc.value, loc.threshold) },
                  ]}>
                    {loc.label}
                  </ThemedText>
                )}
                {loc.type === 'icon' && (
                  <Ionicons name={loc.name} size={22} color={getColor(loc.value, loc.threshold)} />
                )}
                </View>
                <View style={[styles.hRectangle, { marginLeft: windowWidth * 0.03 }]}>
                  <ThemedText style={[
                    styles.rectText,
                    { color: getColor(loc.value, loc.threshold) },
                  ]}>
                    {loc.value.toFixed(2)}
                  </ThemedText>
                </View>
                <View style={[styles.hRectangle, { marginLeft: windowWidth * 0.03 }]}>
                  <ThemedText style={[styles.rectText,
                    { color: getColor(loc.value, loc.threshold) },
                  ]}>
                    {loc.unit}
                  </ThemedText>
                </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (windowWidth: number, windowHeight: number) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D3D3D3', // Light gray
  },

  content: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },

  title: {
    textAlign: 'left',
    color: 'white',
    fontFamily: 'jost',
  },

  vRectangle: {
    position: 'absolute',
    backgroundColor: '#F8F8F8', // Lighter gray
    left: 0,
    top: 0,
    height: windowHeight * 0.5,
    width: windowWidth * 0.15, //60
    borderRadius: 10,
  },

  hRectangle: {
    backgroundColor: '#F8F8F8',
    height: windowWidth * 0.1,
    width: windowWidth * 0.23,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rectText: {
    fontWeight: 600,
    color: 'red',
    fontFamily: 'jost',
  },

  circle: {
    backgroundColor: 'red',
    marginLeft: windowWidth * 0.025,
    height: windowWidth * 0.1,
    width: windowWidth * 0.1,
    borderRadius: windowWidth * 0.05,
  },

  trackContainer: {
    position: 'absolute',
    left: windowWidth * 0.05,
    top: windowHeight * 0.07,
    width: windowWidth * 0.5,
    height: windowHeight * 0.5,
  },

  track: {
    position: 'relative',
    width: windowWidth * 0.15,
    height: windowHeight * 0.5,
  },
});
