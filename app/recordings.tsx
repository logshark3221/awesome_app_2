import { Picker } from '@react-native-picker/picker';
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import React, { useEffect, useState } from 'react';

import { useScreen } from '@/hooks/use-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, downloadAsync, File, Paths } from 'expo-file-system';

import { useBluetoothContext } from '@/hooks/bluetooth-context';
import { ParsedPacket } from '@/hooks/packet-parser';

export default function ThresholdScreen() {

    // Config
    const data_directory = new Directory(Paths.document, "hazmat_drone_data")

    // Styles
    const { windowWidth, windowHeight } = useScreen();
    const styles = createStyles(windowWidth, windowHeight);

    // Bluetooth signal history data
    const { history, clearHistory } = useBluetoothContext();
    const sessionData = history.map(packet => {return packet})

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // File Reading / Writing
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Writes the current session to file
    const writeToFile = () => {
      try {

        // Gets file and directory
        let new_file_name = "Session_0001.json"
        if (! data_directory.exists) {
          data_directory.create()
        }

        // Gets the name of the new session based on existing sessions
        else {
          const files = data_directory.list()
          files.sort(sortFiles)
          
          if (files.length > 0) {
            const last_file_number = (parseInt(files[files.length - 1].name.split("_")[1].split(".")[0]) + 1).toString().padStart(4, "0")
            new_file_name = "Session_" + last_file_number + ".json"
          }
        }
        
        const file = new File(data_directory, new_file_name)
        if (! file.exists) {
          file.create()
        }

        // Converts history to a string, and writes it
        const temp = JSON.stringify(history);
        file.write(temp);

        console.log("File " + new_file_name + " written successfully")

      } catch (error) {
        console.error(error);
      }
    }
  
    // Reads the session saved in file and returns the graph
    const readFromFile = (chart : string) => {
      try {

        // Gets file
        const file_name = chart + ".json"
        const file = new File(data_directory, file_name)
        if (! file.exists) {
          console.log("File " + file.name + " does not exist! Read Failed")
          return
        }

        // Parses file from json format
        const temp = file.textSync();
        const temp2 = JSON.parse(temp)
        return temp2

      } catch (error) {
        console.error(error);
      }
    }

    // Copies a json file to the downloads folder
    // Also just realized half of these functions don't follow the const () => {} format. Whoops
    const copyToDownloads = async () => {
      try {

        // Gets file
        const file_name = selectedChart + ".json"
        const file = new File(data_directory, file_name)
        if (! file.exists) {
          console.log("File " + file.name + " does not exist! Copy Failed")
          return
        }

        // Copies to downloads
        const target_file = downloadAsync

      } catch (error) {
        console.error(error)
      }
    }

    // Deletes all json files
    const cleanFiles = () => {
      try {

        const files = data_directory.list()
        files.sort(sortFiles)

        for (let file of files) {
          file.delete()
        }

        console.log("Files cleaned successfully")
      } catch (error) {
        console.error(error);
      }
    }

    // Helper function, sorts files by their names
    function sortFiles(a : Directory | File, b : Directory | File) {
      return ('' + a.name).localeCompare(b.name);
    }

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Thresholds
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // UI
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Determines picker values
    const [selectedChart, setSelectedChart] = useState("Current Session")
    const [selectedSensor, setSelectedSensor] = useState<'H2S' | 'O2' | 'CO' | 'CH4' | 'Temp'>('H2S')
    const [sensorLowerBound, setSensorLowerBound] = useState(parseInt(thresholds.H2SLower))
    const [sensorUpperBound, setSensorUpperBound] = useState(parseInt(thresholds.H2SUpper))

    // Short function, also sets the upper / lower bounds when the sensor is selected
    function setSensorData(value) {
      setSelectedSensor(value)
      
      switch(value) {
        case 'H2S': setSensorLowerBound(parseInt(thresholds.H2SLower)); setSensorUpperBound(parseInt(thresholds.H2SUpper)); break;
        case 'O2': setSensorLowerBound(parseInt(thresholds.O2Lower)); setSensorUpperBound(parseInt(thresholds.O2Upper)); break;
        case 'CO': setSensorLowerBound(parseInt(thresholds.COLower)); setSensorUpperBound(parseInt(thresholds.COUpper)); break;
        case 'CH4': setSensorLowerBound(parseInt(thresholds.CH4Lower)); setSensorUpperBound(parseInt(thresholds.CH4Upper)); break;
        case 'Temp':setSensorLowerBound(parseInt(thresholds.TempLower)); setSensorUpperBound(parseInt(thresholds.TempUpper)); break;
      }
    }

    // Stores the last data and selected in memory to save storage read/writes, but it doesn't work very well. Maybe find a better way later
    const[lastSelected, setLastSelected] = useState("Current Session")
    const[lastData, setLastData] = useState(null)

    function onPick(value: string) {

      // Handles last seen data
      if (value == "Current Session") {
        setLastSelected("Current Session")
        setLastData(null)
      }

      else if (!(value == lastSelected)){
          setLastData(readFromFile(value))
          setLastSelected(value)
      }

      // Sets last selected
      setSelectedChart(value)
    }

    
    // Parses read session data into data that can be shown on the graph
    function graphMap(value) {

      // Special case for "current session", displays the current session
      if (selectedChart == "Current Session") {
        const chartData = history.map((packet: ParsedPacket) => {
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
          }
        })

        return chartData
      }

      // Shouldn't happen, but just in case
      if (value == null) {
        return null
      }

      // Displays the recorded session
      const chartData = value.map((packet: ParsedPacket) => {
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
      })

      return chartData
    }

    // Gets the colors for each point on the graph
    const getColor = (sensor: string, reading: number) => {
      const map: Record<string, { lower: string; upper: string}> = {
        H2S: { lower: thresholds.H2SLower, upper: thresholds.H2SUpper },
        O2: { lower: thresholds.O2Lower, upper: thresholds.O2Upper },
        CO: { lower: thresholds.COLower, upper: thresholds.COUpper },
        CH4: { lower: thresholds.CH4Lower, upper: thresholds.CH4Upper },
        Temp: { lower: thresholds.TempLower, upper: thresholds.TempUpper },
      }

      const lower = parseFloat(map[sensor].lower);
      const upper = parseFloat(map[sensor].upper);

      if(!Number.isFinite(lower) || !Number.isFinite(upper)) return 'green';

      return reading < lower || reading > upper ? 'red' : 'green';
    }

    // Deletes a session file, and resets all selections to the default
    function deleteSession() {

      // Gets the current session name
      const sessionName = selectedChart

      // Deselects everything
      onPick("Current Session")

      // Attempts file deletion
      try {

        // Gets file
        const file_name = sessionName + ".json"
        const file = new File(data_directory, file_name)
        if (! file.exists) {
          console.log("File " + file.name + " does not exist! Deletion Failed")
          return
        }

        file.delete()

      } catch (error) {
        console.error(error);
      }
    }


    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  return (
    <KeyboardAvoidingView
      style={{flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>

        <View style = {styles.col}>
          <View style = {[styles.hRectangle, { flex: 0.2, backgroundColor: '#9D2235'},]}>
            <Picker
              selectedValue={"Current Session"}
              onValueChange={(itemValue) => onPick(itemValue)}
              selectionColor={"black"}
              dropdownIconColor={"black"}
              dropdownIconRippleColor={"black"}
            >
              <Picker.Item label="Current Session" value="Current Session" />
              {data_directory.list().sort(sortFiles).map((item, index) => (
                <Picker.Item 
                  key={index}
                  label={item.name.split(".")[0]} 
                  value={item.name.split(".")[0]} 
                />
              ))}
            </Picker>
          </View>

          <View style = {[styles.hRectangle, { flex: 0.2, backgroundColor: '#9D2235'},]}>
            <Picker
                selectedValue={selectedSensor}
                onValueChange={(itemValue) => setSensorData(itemValue)}
            >
                <Picker.Item label="H2S" value="H2S" />
                <Picker.Item label="O2" value="O2" />
                <Picker.Item label="CO" value="CO" />
                <Picker.Item label="CH4" value="CH4" />
                <Picker.Item label="Temp" value="Temp" />
            </Picker>
          </View>

          <View style = {[styles.hRectangle, { flex: 0.2, backgroundColor: '#9D2235'},]}>
              <Button onPress={writeToFile} title={"Write Current Session to File"} color='#9D2235'/>
          </View>

          <View style = {[styles.hRectangle, { flex: 0.2, backgroundColor: '#9D2235'},]}>
              {selectedChart == "Current Session" ? <Button onPress={clearHistory} title={"Clear Current Session"} color='#9D2235'/> : <Button onPress={deleteSession} title={"Delete Recorded Session"} color='#9D2235'/>}
          </View>

          {selectedChart == "Current Session" ? null : <View style = {[styles.hRectangle, { flex: 0.2, backgroundColor: '#9D2235'},]}>
            <Button onPress={copyToDownloads} title={"Download File (To Downloads Folder)"} color='#9D2235'/>
          </View>}
              
        </View>

        <LineChart
            data={graphMap(lastData)}
            width={windowWidth}
            height={300}
            spacing={10}
            referenceLine1Position = {sensorLowerBound}
            showReferenceLine1
            referenceLine2Position= {sensorUpperBound}
            showReferenceLine2
            hideDataPoints={false}
            yAxisLabelTexts={[]}
            yAxisColor="transparent"
        />

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

  hRectangle: {
    backgroundColor: '#9D2235',
    borderRadius: 10,
    flex: 0.3,
    height: 40,
    borderWidth: 1,
    padding: 2,
    margin: 6,
    justifyContent: 'center',
    // alignItems: 'center',
  },

  col: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
    gap: 4,
  },
});
