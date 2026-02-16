import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRACK_HEIGHT = 400;
const CIRCLE_SIZE = 40;
const RECT_HEIGHT = 40;
const CIRCLE_COUNT = 5;
const spacing = (TRACK_HEIGHT - CIRCLE_COUNT * CIRCLE_SIZE) / (CIRCLE_COUNT + 1);

export default function HomeScreen() {

  type Item = 
    | { type: 'chemical'; label: string }
    | { type: 'icon', name: keyof typeof Ionicons.glyphMap };

  const items: Item[] = [
    { type: 'chemical', label: 'H₂S' },
    { type: 'chemical', label: 'O₂' },
    { type: 'chemical', label: 'CO' },
    { type: 'chemical', label: 'CH₄' },
    { type: 'icon', name: 'thermometer-outline'},
  ];

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
              <View style={styles.circle} />
              <View style={[styles.hRectangle, { marginLeft: 40 }]}>
                {loc.type === 'chemical' && (
                  <ThemedText style={styles.rectText}>
                    {loc.label}
                  </ThemedText>
                )}
                {loc.type === 'icon' && (
                  <Ionicons name={loc.name} size={22} color="red" />
                )}
                </View>
            </View>
          ))}
        </View>
      </View>
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
    fontFamily: 'jost',
  },

  vRectangle: {
    position: 'absolute',
    backgroundColor: '#F8F8F8', // Lighter gray
    left: 0,
    top: 0,
    height: TRACK_HEIGHT,
    width: 60,
    borderRadius: 10,
  },

  hRectangle: {
    backgroundColor: '#F8F8F8',
    height: RECT_HEIGHT,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rectText: {
    fontWeight: 600,
    color: 'red',
  },

  circle: {
    backgroundColor: 'red',
    marginLeft: 10,
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: 20,
  },

  trackContainer: {
    position: 'absolute',
    left: 20,
    top: 60,
    width: 200,
    height: TRACK_HEIGHT,
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
