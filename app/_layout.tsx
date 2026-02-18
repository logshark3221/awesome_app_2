import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1}}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              {pathname === '/' ? 'GO/NO-GO': 'THRESHOLDS'}
            </ThemedText>
          </View>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          {/* Bottom banner */}
          <View style={styles.bottomBanner}>
            <Pressable style={[
              styles.button,
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
    justifyContent: 'center',
    alignItems: 'center',
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
    right: windowWidth * 0.05,
    top: windowWidth * 0.05,
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