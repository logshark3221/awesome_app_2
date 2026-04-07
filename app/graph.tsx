import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { useBluetoothContext } from '@/hooks/bluetooth-context';
import { useScreen } from '@/hooks/use-screen';

export default function GraphScreen() {
    const { windowWidth, windowHeight } = useScreen();
    const styles = createStyles(windowWidth, windowHeight);

    const { history } = useBluetoothContext();
    const [selectedSensor, setSelectedSensor] = useState<'H2S' | 'O2' | 'CO' | 'CH4' | 'Temp'>('H2S');

    const chartData = history.map(packet => {
        switch(selectedSensor) {
            case 'H2S': return { value: packet.parsedH2S };
            case 'O2': return { value: packet.parsedO2 };
            case 'CO': return { value: packet.parsedCO };
            case 'CH4': return { value: packet.parsedCH4 };
            case 'Temp': return { value: packet.parsedTemp };
        }
    }).slice(-50)

    return (
        <View style={styles.content}>
            <Picker
                selectedValue={selectedSensor}
                onValueChange={(itemValue) => setSelectedSensor(itemValue)}
            >
                <Picker.Item label="H2S" value="H2S" />
                <Picker.Item label="O2" value="O2" />
                <Picker.Item label="CO" value="CO" />
                <Picker.Item label="CH4" value="CH4" />
                <Picker.Item label="Temp" value="Temp" />
            </Picker>
            <View style={{ flexDirection: 'row', padding: 10 }}>
                {/* <View style={{ justifyContent: 'space-between', height: 300, marginRight: 5}}>
                    <Text>100</Text>
                    <Text>90</Text>
                    <Text>80</Text>
                    <Text>70</Text>
                    <Text>60</Text>
                    <Text>50</Text>
                    <Text>40</Text>
                    <Text>30</Text>
                    <Text>20</Text>
                    <Text>10</Text>
                    <Text>0</Text>
                </View> */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <LineChart
                        data={chartData}
                        width={Math.max(chartData.length * 40, windowWidth)}
                        height={300}
                        spacing={40}
                        hideDataPoints={false}
                        yAxisLabelTexts={[]}
                        yAxisColor="transparent"
                    />
                </ScrollView>
            </View>
        </View>
    );
}

const createStyles = (windowWidth: number, windowHeight: number) => StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#D3D3D3',
    },
})