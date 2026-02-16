import { ThemedText } from '@/components/themed-text';
import { useScreen } from '@/hooks/use-screen';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CIRCLE_COUNT = 5;

export default function HomeScreen() {

  type Item = 
    | { type: 'chemical'; label: string; value: string }
    | { type: 'icon', name: keyof typeof Ionicons.glyphMap, value: string };

  const items: Item[] = [
    { type: 'chemical', label: 'H₂S', value: '20.00' },
    { type: 'chemical', label: 'O₂', value: '20.00' },
    { type: 'chemical', label: 'CO', value: '20.00' },
    { type: 'chemical', label: 'CH₄', value: '20.00' },
    { type: 'icon', name: 'thermometer-outline', value: '20.00'},
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
              <View style={styles.circle} />
              <View style={[styles.hRectangle, { marginLeft: windowWidth * 0.05 }]}>
                {loc.type === 'chemical' && (
                  <ThemedText style={styles.rectText}>
                    {loc.label}
                  </ThemedText>
                )}
                {loc.type === 'icon' && (
                  <Ionicons name={loc.name} size={22} color="red" />
                )}
                </View>
                <View style={[styles.hRectangle, { marginLeft: windowWidth * 0.05 }]}>
                  <ThemedText style={styles.rectText}>
                    {loc.value}
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
    width: windowWidth * 0.25,
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
