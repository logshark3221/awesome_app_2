import { ThemedText } from '@/components/themed-text';
import { useBluetoothData } from '@/hooks/use-bluetooth-data';
import { useScreen } from '@/hooks/use-screen';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

const CIRCLE_COUNT = 5;

export default function HomeScreen() {

  const DEFAULT_THRESHOLDS = {
    H2SThreshold: '10.00',
    O2Threshold: '23.50',
    O2LowerThreshold: '19.50',
    COThreshold: '50.00',
    CH4Threshold: '5.00',
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

  // set values based on Bluetooth data
  const { latestPacket } = useBluetoothData();
  useEffect(()=> {
    if (!latestPacket) return;
    setReadings({
      H2S: latestPacket.parsedH2S,
      O2: latestPacket.parsedO2,
      CO: latestPacket.parsedCO,
      CH4: latestPacket.parsedCH4,
      Temp: latestPacket.parsedTemp,
    });
  }, [latestPacket]);

  const getColor = (sensor: string, reading: number) => {
    if (sensor === 'O2') {
      const lower = parseFloat(thresholds.O2LowerThreshold);
      const upper = parseFloat(thresholds.O2Threshold);
      return reading < lower || reading > upper ? 'red' : 'green';
    }
    const thresholdMap: Record<string, string> = {
      H2S: thresholds.H2SThreshold,
      CO: thresholds.COThreshold,
      CH4: thresholds.CH4Threshold,
      Temp: thresholds.TemperatureThreshold,
    };

    return reading > parseFloat(thresholdMap[sensor]) ? 'red' : 'green';
  };

  type Item = 
    | {
      type: 'chemical';
      sensor: string,
      label: string;
      value: number;
      unit: string;
    }
    | {
      type: 'icon';
      sensor: string;
      name: keyof typeof Ionicons.glyphMap;
      value: number;
      unit: string;
    };

  const items: Item[] = [
    {
      type: 'chemical',
      sensor: 'H2S',
      label: 'H₂S',
      value: readings.H2S,
      unit: 'PPM',
    },
    {
      type: 'chemical',
      sensor: 'O2',
      label: 'O₂',
      value: readings.O2,
      unit: '%',
    },
    {
      type: 'chemical',
      sensor: 'CO',
      label: 'CO',
      value: readings.CO,
      unit: 'PPM',
    },
    {
      type: 'chemical',
      sensor: 'CH4',
      label: 'CH₄',
      value: readings.CH4,
      unit: '%',
    },
    {
      type: 'icon',
      sensor: 'Temp',
      name: 'thermometer-outline',
      value: readings.Temp,
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
                { backgroundColor: getColor(loc.sensor, loc.value)},
              ]} />
              <View style={[styles.hRectangle, { marginLeft: windowWidth * 0.05 }]}>
                {loc.type === 'chemical' && (
                  <ThemedText style={[styles.rectText,
                    { color: getColor(loc.sensor, loc.value) },
                  ]}>
                    {loc.label}
                  </ThemedText>
                )}
                {loc.type === 'icon' && (
                  <Ionicons name={loc.name} size={22} color={getColor(loc.sensor, loc.value)} />
                )}
                </View>
                <View style={[styles.hRectangle, { marginLeft: windowWidth * 0.03 }]}>
                  <ThemedText style={[
                    styles.rectText,
                    { color: getColor(loc.sensor, loc.value) },
                  ]}>
                    {loc.value.toFixed(2)}
                  </ThemedText>
                </View>
                <View style={[styles.hRectangle, { marginLeft: windowWidth * 0.03 }]}>
                  <ThemedText style={[styles.rectText,
                    { color: getColor(loc.sensor, loc.value) },
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
