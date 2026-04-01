import React from 'react';
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useScreen } from '@/hooks/use-screen';

import { File, Directory, Paths } from 'expo-file-system';


export default function ThresholdScreen() {
  const { windowWidth, windowHeight } = useScreen();
  const styles = createStyles(windowWidth, windowHeight);

  const test = () => {
    try {
      const file = new File(Paths.cache, 'example.txt');

      // Write
      if (! file.exists) {
        file.create(); // can throw an error if the file already exists or no permission to create it
        file.write('Hello, world!');
      }
      
      // Read
      console.log(file.textSync()); // Hello, world!

    } catch (error) {
      console.error(error);
    }
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
          onPress={test}
          title={"Test Button"}
          color='#808080'
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
});
