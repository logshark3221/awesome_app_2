import { ThemedText } from '@/components/themed-text';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  const isExplore = pathname == '/explore';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      {/* Bottom banner */}
      <View style={styles.bottomBanner}>
        <Pressable style={styles.button}
        onPress={() => {
          if (isExplore) {
            router.replace('/');
          }
          else {
            router.replace('/explore');
          }
        }}>
          <ThemedText style={styles.buttonText}>
            THRESHOLDS
          </ThemedText>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  bottomBanner: {
    height: 100,
    backgroundColor: '#9D2235',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#D3D3D3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
  }
})