import { StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { useScreen } from '@/hooks/use-screen';

export default function GraphScreen() {
    const { windowWidth, windowHeight } = useScreen();
    const styles = createStyles(windowWidth, windowHeight);

    return (
        <View style={styles.content}>
            <LineChart
                data={[
                    { value: 10 },
                    { value: 20 },
                    { value: 15 },
                    { value: 40 },
                ]}
            />
        </View>
    );
}

const createStyles = (windowWidth: number, windowHeight: number) => StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#D3D3D3',
    },
})