import React from 'react';
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { useScreen } from '@/hooks/use-screen';

import { ThemedText } from '@/components/themed-text';
import { File, Paths } from 'expo-file-system';

import { useBluetoothContext } from '@/hooks/bluetooth-context';

export default function ThresholdScreen() {
  const { windowWidth, windowHeight } = useScreen();
  const styles = createStyles(windowWidth, windowHeight);

  const { history, clearHistory } = useBluetoothContext();
  const sessionData = history.map(packet => {return packet})

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

  const readFromFile = () => {
    try {

      // Gets file
      const file = new File(Paths.cache, 'example.json');
      if (! file.exists) {
        console.log("File does not exist!")
        return
      }

      const temp = file.textSync();
      console.log(JSON.parse(temp))

    } catch (error) {
      console.error(error);
    }
  }

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

  const printToLog = () => {
    console.log(sessionData)
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
          onPress={printToLog}
          title={"Print Session to Log"}
          color='#808080'
        />

        <Button
          onPress={clearHistory}
          title={"Clear Session"}
          color='#808080'
        />

        <ThemedText darkColor='black' lightColor='black'>Current Session Size: {sessionData.length}</ThemedText>
        
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
