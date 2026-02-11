import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.header}> {/* Start of header */}
        <ThemedText type="title" style={styles.title}>
          GO/NO-GO
        </ThemedText>
      </ThemedView> {/* End of header */}
      <View style={styles.content}> {/* Start of main body */}
      </View> {/* End of main body */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D3D3D3', // Light gray
  },

  content: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },

  header: {
    height: 64,
    backgroundColor: '#9D2235', // Razorback Red
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  title: {
    textAlign: 'left',
    color: 'white',
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
