import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRACK_HEIGHT = 400;
const CIRCLE_SIZE = 40;
const CIRCLE_COUNT = 5;
const spacing = (TRACK_HEIGHT - CIRCLE_COUNT * CIRCLE_SIZE) / (CIRCLE_COUNT + 1);

export default function HomeScreen() {

  const locations = Array.from({ length: CIRCLE_COUNT }, (_, i) => ({
    id: i,
    top: spacing + i * (CIRCLE_SIZE + spacing),
  }))

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.header}> {/* Start of header */}
        <ThemedText type="title" style={styles.title}>
          GO/NO-GO
        </ThemedText>
      </ThemedView> {/* End of header */}
      <View style={styles.content}> {/* Start of main body */}
        <View style={styles.trackContainer}>
          <View style={styles.rectangle} />
          {locations.map(loc => (
            <View key={loc.id} style={[styles.circle, {top: loc.top}]} />
          ))}
        </View>
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

  rectangle: {
    position: 'absolute',
    backgroundColor: '#F8F8F8',
    left: 0,
    top: 0,
    height: TRACK_HEIGHT,
    width: 60,
    borderRadius: 10,
  },

  circle: {
    position: 'absolute',
    backgroundColor: 'red',
    left: 10,
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: 20,
  },

  trackContainer: {
    position: 'absolute',
    left: 20,
    top: 60,
  },

  track: {
    position: 'relative',
    width: 60,
    height: 400,
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
