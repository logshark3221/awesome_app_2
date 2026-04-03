import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';


import { BluetoothContext } from '@/hooks/bluetooth-context';
import useBLE from '@/hooks/use-BLE';
import { useBluetoothData } from '@/hooks/use-bluetooth-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreen } from '@/hooks/use-screen';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function RootLayout() {
  const { windowWidth, windowHeight } = useScreen();
  const styles = createStyles(windowWidth, windowHeight);
  
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  const isThresholds = pathname === '/thresholds';
  const isGraph = pathname === '/graph';
  const isRecordings = pathname === '/recordings';

  const { HazmatReads } = useBLE();

  const bluetooth = useBluetoothData(HazmatReads);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BluetoothContext.Provider value={bluetooth}>
        <SafeAreaView style={styles.safeArea}>
          <View style={{ flex: 1}}>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                {
                  pathname === '/' ? 'GO/NO-GO': 
                  pathname === '/thresholds' ? 'THRESHOLDS' :
                  pathname === '/graph'? 'GRAPH': 
                  pathname === '/recordings'? 'RECORDINGS': 
                  ''
                }
              </ThemedText>
            </View>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            {/* Bottom banner */}
            <View style={styles.bottomBanner}>

              {/* Graph Screen */}
              <Pressable style={[
                styles.button,
                {
                  position: 'absolute',
                  left: windowWidth * 0.05,
                },
              ]}
              onPress={() => {
                if (isGraph) {
                  router.replace('/');
                }
                else {
                  router.replace('/graph');
                }
              }}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={windowWidth * 0.125}
                  color={isGraph ? '#9D2235' : 'black'} />
              </Pressable>

              {/* Recorded Sessions */}
              <Pressable style={[
                styles.button,
              ]}
              onPress={() => {
                if (isRecordings) {
                  router.replace('/');
                }
                else {
                  router.replace('/recordings');
                }
              }}>
                <MaterialCommunityIcons
                  name="database"
                  size={windowWidth * 0.125}
                  color={isRecordings ? '#9D2235' : 'black'} />
              </Pressable>

              {/* // Thresholds */}
              <Pressable style={[
                styles.button,
                {
                  position: 'absolute',
                  right: windowWidth * 0.05,
                },
              ]}
              onPress={() => {
                if (isThresholds) {
                  router.replace('/');
                }
                else {
                  router.replace('/thresholds');
                }
              }}>
                <MaterialCommunityIcons
                  name="pencil-box-outline"
                  size={windowWidth * 0.125}
                  color={isThresholds? '#9D2235' : 'black'} />
              </Pressable>
            </View>
            <StatusBar style="auto" />
          </View>
        </SafeAreaView>
      </BluetoothContext.Provider>
    </ThemeProvider>
  );
}

const createStyles = (windowWidth: number, windowHeight: number) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#9D2235', // Light gray
  },
  
  bottomBanner: {
    height: windowHeight * 0.13,
    backgroundColor: '#9D2235',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  header: {
    height: windowHeight * 0.07,
    backgroundColor: '#9D2235', // Razorback Red
    justifyContent: 'center',
    paddingHorizontal: windowWidth * 0.05,
  },

  title: {
    textAlign: 'left',
    color: 'white',
    fontFamily: 'jost',
  },

  button: {
    position: 'absolute',
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    backgroundColor: '#D3D3D3',
    borderRadius: windowWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
  }
})