import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { useBluetoothContext } from '@/hooks/bluetooth-context';
import { useScreen } from '@/hooks/use-screen';

export default function GraphScreen() {
    const { windowWidth, windowHeight } = useScreen();
    const styles = createStyles(windowWidth, windowHeight);

    const { history } = useBluetoothContext();
    const [selectedSensor, setSelectedSensor] = useState<'H2S' | 'O2' | 'CO' | 'CH4' | 'Temp'>('H2S');

    const [thresholds, setThresholds] = useState({
        H2SLower: '0',
        H2SUpper: '10.00',
        O2Lower: '19.50',
        O2Upper: '23.50',
        COLower: '0',
        COUpper: '50.00',
        CH4Lower: '0',
        CH4Upper: '5.00',
        TempLower: '32.00',
        TempUpper: '95.00',
    });

    useEffect(() => {
        const loadThresholds = async () => {
            const updated = { ...thresholds };
            for(const key of Object.keys(updated)) {
                const stored = await AsyncStorage.getItem(key);
                if(stored !== null) {
                    updated[key as keyof typeof thresholds] = stored;
                }
            }
            setThresholds(updated);
        };
        loadThresholds();
    }, []);

    const getColor = (sensor: string, reading: number) => {
        const map: Record<string, { lower: string; upper: string }> = {
            H2S: { lower: thresholds.H2SLower, upper: thresholds.H2SUpper },
            O2: { lower: thresholds.O2Lower, upper: thresholds.O2Upper },
            CO: { lower: thresholds.COLower, upper: thresholds.COUpper },
            CH4: { lower: thresholds.CH4Lower, upper: thresholds.CH4Upper },
            Temp: { lower: thresholds.TempLower, upper: thresholds.TempUpper },
        };

        const lower = parseFloat(map[sensor].lower);
        const upper = parseFloat(map[sensor].upper);

        if(!Number.isFinite(lower) || !Number.isFinite(upper)) return 'green';

        return reading < lower || reading > upper ? 'red' : 'green';
    }

    const chartData = history.map(packet => {
        let value = 0;
        switch(selectedSensor) {
            case 'H2S': value = packet.parsedH2S; break;
            case 'O2': value = packet.parsedO2; break;
            case 'CO': value = packet.parsedCO; break;
            case 'CH4': value = packet.parsedCH4; break;
            case 'Temp': value = packet.parsedTemp; break;
        }
        return {
            value, dataPointColor: getColor(selectedSensor, value),
        };
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