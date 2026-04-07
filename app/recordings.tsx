import React from 'react';
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { useScreen } from '@/hooks/use-screen';

import { ThemedText } from '@/components/themed-text';
import { File, Paths } from 'expo-file-system';

import { useBluetoothContext } from '@/hooks/bluetooth-context';
import { ParsedPacket } from '@/hooks/packet-parser';

export default function ThresholdScreen() {

    // Styles
    const { windowWidth, windowHeight } = useScreen();
    const styles = createStyles(windowWidth, windowHeight);

    // Bluetooth signal history data
    const { history, clearHistory } = useBluetoothContext();
    const sessionData = history.map(packet => {return packet})

    // Chart Stuff
    const chartData = history.map(packet => {return {value : packet.parsedH2S}}).slice(-50)

    // Writes the current session to file
    const writeToFile = () => {
      try {

        // Gets file
        const file = new File(Paths.cache, 'example.json');
        if (! file.exists) {
          file.create(); // Can throw an error if the file already exists or no permission to create it
        }

        // Converts history to a string, and writes it
        const temp = JSON.stringify(history);
        file.write(temp);

        console.log("File written successfully")

      } catch (error) {
        console.error(error);
      }
    }
  
    // Reads the session saved in file and prints it to the log (and stores it in memory)
    const readFromFile = () => {
      try {

        // Gets file
        const file = new File(Paths.cache, 'example.json');
        if (! file.exists) {
          console.log("File does not exist!")
          return
        }

        const temp = file.textSync();
        const temp2 = JSON.parse(temp)

        // Prints to log
        console.log(temp2)
        console.log(temp2.map((entry: ParsedPacket) => {return {value : entry.parsedH2S}}).slice(-50))

        changeTempData(temp2.map((entry: ParsedPacket) => {return {value : entry.parsedH2S}}).slice(-50))
        changeShowRecordedChart(true)

      } catch (error) {
        console.error(error);
      }
    }

    // Deletes the json and text files
    const cleanFiles = () => {
      try {

        const file1 = new File(Paths.cache, 'example.json');
        const file2 = new File(Paths.cache, 'example.txt');
        file1.delete()
        file2.delete()

        console.log("Files cleaned successfully")
      } catch (error) {
        console.error(error);
      }
    }

    // Prints the current session to the console
    const printToConsole = () => {
      console.log(sessionData)
    }


    // Some graph stuff for the recorded graph. Strongly consider deleting later
    const [showRecordedChart, changeShowRecordedChart] = React.useState(false);
    const [tempData, changeTempData] = React.useState([])
    function ConditionalGraph( { showChart } : { showChart : boolean}) {
      if (showChart) {
        return <LineChart
            data={tempData}
            width={windowWidth}
            height={300}
            spacing={(windowWidth / chartData.length) / 1.4}
            hideDataPoints={false}
            yAxisLabelTexts={[]}
            yAxisColor="transparent"
        />
      }
      return null
    }

  return (
    <KeyboardAvoidingView
      style={{flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>

        <Button
          onPress={writeToFile}
          title={"Write Session to File"}
          color='#808080'
        />

        <Button
          onPress={readFromFile}
          title={"Read Session from File"}
          color='#808080'
        />

        <Button
          onPress={cleanFiles}
          title={"Clean (Delete) Files"}
          color='#808080'
        />

        <Button
          onPress={printToConsole}
          title={"Print Session to Log"}
          color='#808080'
        />

        <Button
          onPress={clearHistory}
          title={"Clear Session"}
          color='#808080'
        />

        <ThemedText darkColor='black' lightColor='black'>Current Session Size: {sessionData.length}</ThemedText>

        <LineChart
            data={chartData}
            width={windowWidth}
            height={300}
            spacing={(windowWidth / chartData.length) / 1.4}
            hideDataPoints={false}
            yAxisLabelTexts={[]}
            yAxisColor="transparent"
        />

        <ThemedText darkColor='black' lightColor='black'>Recorded Session (JSON File) Size: {tempData.length}</ThemedText>
        <LineChart
            data={tempData}
            width={windowWidth}
            height={300}
            spacing={(windowWidth / tempData.length) / 1.4}
            hideDataPoints={false}
            yAxisLabelTexts={[]}
            yAxisColor="transparent"
        />

        {/* <ConditionalGraph
          showChart = {showRecordedChart}
        /> */}
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (windowWidth: number, windowHeight: number) => StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },

  content: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#D3D3D3',
  },

  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
