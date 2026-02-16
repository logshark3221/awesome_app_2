import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
            if (isExplore) {
              router.replace('/');
            }
            else {
              router.replace('/explore');
            }
          }}>
            <MaterialCommunityIcons
              name="pencil-box-outline"
              size={48}
              color={isExplore? '#9D2235' : 'black'} />
          </Pressable>
        </View>
        <StatusBar style="auto" />
      </View>
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

  header: {
    height: 100,
    backgroundColor: '#9D2235', // Razorback Red
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  title: {
    textAlign: 'left',
    color: 'white',
    fontFamily: 'jost',
  },

  button: {
    position: 'absolute',
    right: 30,
    top: 16,
    width: 80,
    height: 80,
    backgroundColor: '#D3D3D3',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
  }
})