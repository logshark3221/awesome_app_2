import { ThemedText } from '@/components/themed-text';
import { useBluetoothContext } from '@/hooks/bluetooth-context';
import { useScreen } from '@/hooks/use-screen';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import AsyncStorage from '@react-native-async-storage/async-storage';

const CIRCLE_COUNT = 5;

export default function HomeScreen() {

  const DEFAULT_THRESHOLDS = {
    H2SLower: '0',
    H2SUpper: '10.00',
    O2Lower: '19.50',
    O2Upper: '23.50',
    COLower: '0',
    COUpper: '50.00',
    CH4Lower: '0',
    CH4Upper: '5.00',
    TempLower: '32.00',
    TempUpper: '95.00',
  };

  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);

  const [readings, setReadings] = useState({
    H2S: 0,
    O2: 0,
    CO: 0,
    CH4: 0,
    Temp: 0,
  });

  const {
    latestPacket,
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    allDevices,
    connectedDevice,
  } = useBluetoothContext();

  const handleConnect = async () => {
    if (connectedDevice) {
      disconnectFromDevice();
      return;
    }

    const isPermissionEnabled = await requestPermissions();
    if (!isPermissionEnabled) {
      console.log('Permissions not granted');
      return;
    }

    scanForPeripherals();

    // Give scan a few seconds to find devices
    setTimeout(async () => {
      if (allDevices.length > 0) {
        await connectToDevice(allDevices[0]);
      } else {
        Alert.alert('No Devices Found', 'Make sure your device is powered on and nearby, then try again.');
      }
    }, 2000);
  };

  // run once
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
    const map: Record<string, { lower: string; upper: string}> = {
      H2S: { lower: thresholds.H2SLower, upper: thresholds.H2SUpper },
      O2: { lower: thresholds.O2Lower, upper: thresholds.O2Upper },
      CO: { lower: thresholds.COLower, upper: thresholds.COUpper },
      CH4: { lower: thresholds.CH4Lower, upper: thresholds.CH4Upper },
      Temp: { lower: thresholds.TempLower, upper: thresholds.TempUpper },
    };

    const lower = parseFloat(map[sensor].lower);
    const upper = parseFloat(map[sensor].upper);
    const val = Number(reading);

    if (!Number.isFinite(lower) || !Number.isFinite(upper)) return 'green';

    return val < lower || val > upper ? 'red' : 'green';
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
          <View
            key={loc.id}
            style={{
              position: 'absolute',
              top: loc.top,
              left: 0,
              right: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={[
                styles.circle,
                { backgroundColor: getColor(loc.sensor, loc.value) },
              ]}
            />

            <View
              style={[
                styles.hRectangle,
                { marginLeft: windowWidth * 0.05 },
              ]}
            >
              {loc.type === 'chemical' && (
                <ThemedText
                  style={[
                    styles.rectText,
                    { color: getColor(loc.sensor, loc.value) },
                  ]}
                >
                  {loc.label}
                </ThemedText>
              )}

              {loc.type === 'icon' && (
                <Ionicons
                  name={loc.name}
                  size={22}
                  color={getColor(loc.sensor, loc.value)}
                />
              )}
            </View>

            <View
              style={[
                styles.hRectangle,
                { marginLeft: windowWidth * 0.03 },
              ]}
            >
              <ThemedText
                style={[
                  styles.rectText,
                  { color: getColor(loc.sensor, loc.value) },
                ]}
              >
                {loc.value.toFixed(2)}
              </ThemedText>
            </View>

            <View
              style={[
                styles.hRectangle,
                { marginLeft: windowWidth * 0.03 },
              ]}
            >
              <ThemedText
                style={[
                  styles.rectText,
                  { color: getColor(loc.sensor, loc.value) },
                ]}
              >
                {loc.unit}
              </ThemedText>
            </View>

          </View>
        ))}
      </View>
    </View>

    <TouchableOpacity
      style={[
        styles.connectButton,
        {
          backgroundColor: connectedDevice ? 'red' : '#2E7D32',
        },
      ]}
      onPress={handleConnect}
    >
      <ThemedText style={styles.connectText}>
        {connectedDevice ? 'Disconnect' : 'Connect'}
      </ThemedText>
    </TouchableOpacity>

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

  connectButton: {
    position: 'absolute',
    bottom: windowHeight * 0.05,
    alignSelf: 'center',
    width: windowWidth * 0.6,
    height: windowHeight * 0.07,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  
  connectText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'jost',
  },
  
});
