import { IconSymbol } from '@/components/ui/icon-symbol';
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

  const isExplore = pathname === '/explore';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      {/* Bottom banner */}
      <View style={styles.bottomBanner}>
        <Pressable style={[
          styles.button,
        ]}
        onPress={() => {
          if (isExplore) {
            router.replace('/');
          }
          else {
            router.replace('/explore');
          }
        }}>
          <IconSymbol
            name="pencil.and.outline"
            size={28}
            color={isExplore? '#9D2235' : 'black'} />
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  bottomBanner: {
    height: 150,
    backgroundColor: '#9D2235',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    position: 'absolute',
    right: 30,
    top: 16,
    width: 80,
    height: 80,
    backgroundColor: '#D3D3D3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 40,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
  }
})