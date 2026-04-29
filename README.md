# README - Setup and Running app

This README explains installing necessary APIs and how to run the application

# Overview

This project is a React Native (Expo) mobile app that connects to a **UART-controlled LoRa module** via BLE and displays real-time environmental data. It evaluates these readings against adjustable thresholds and provides a clear safety visual indicator

# Features

- Bluetooth connection to external hardware device
- Real-time sensor data
- Historical graphing of sensor values
- Configurable upper and lower safety thresholds
- Live Go/No-Go feedback based on set thresholds
- Persistent threshold storage using AsyncStorage

## Expected hardware setup

This app expects an **Atmega32U4** connected to:

- a **UART-controlled LoRa module**
- several analog sensor inputs
- status LEDs
- a continuous BLE signal from the LoRa module

## Expected Sensor Inputs

- Hydrogen Sulfide, measured in 'PPM'
- Oxygen, measured in '%'
- Carbon Monoxide, measured in 'PPM'
- Methane, measured in '%'
- Temperature, measured in 'F'

### Software Stack

- React Native (Expo)
- TypeScript
- AsyncStorage (react-native-async-storage)
- Gifted Charts (react-native-gifted-charts)
- Expo File System (expo-file-system)

### Installation instructions for Windows

1. Install node.js
    Go to this website: https://nodejs.org/en/download and follow the installation instructions
    npm will be included in this installation

2. Install pnpm
    Type this line into powershell:
        npx pnpm@latest-10 dlx @pnpm/exe@latest-10 setup

3. Clone the repository
    git clone <https://github.com/logshark3221/awesome_app_2>
    cd <https://github.com/logshark3221/awesome_app_2>

4. Install dependencies
    pnpm install

5. Install Expo CLI (if not already installed)
    pnpm install -g expo-cli

### Running the App

1. In the Git terminal, type pnpx expo start

2. Run on an operating system
    - Physical device
        type 's' then scan the QR code with the Expo Go app
    - Android emulator
        type 'a'
    - Web browser (no bluetooth functionality, for development only)
        type 'w', then go into developer mode (CTRL + SHIFT + i) to see actual UI

#### Bluetooth Usage

1. Ensure the hardware devices are sending signals

2. Tap the green "Connect" button

3. The app will connect to the first available device and begin receiving data packets

#### Threshold Configuration

- Press the button on the far right with the pencil icon to navigate to the Thresholds screen

- The default values set are the OSHA standards for every gas and temperature

- Each sensor has an upper and lower threshold that can be modified
    - If a reading is over the upper threshold or under the lower threshold, it will appear red on the Go/No-Go screen and the Graph screen

- The thresholds are saved locally via AsyncStorage and persist over the screens


#### Recordings

- Press the button in the center of the bottom navigation bar to move to the recordings screen

- By default, the recordings screen shows all recorded sensor data for the current recorded session.
    - The graph is otherwise identical to the one on the graph screen. Use the dropdown menu to display different sensor data to the graph.

- There are two buttons when the current session is selected that save or clear the current session.
    - The top button saves the session to the app's internal files. 
    - The bottom button clears all of the current session's recorded readings.

- Recorded sessions can be selected by the dropdown menu at the top of the screen. Once selected, the graph will display that session's recorded readings. The two buttons now change functionality.
    - The top button will prompt the user to save the selected session to a folder of their choosing. The output file is a json file that contains all of that session's recorded sensor readings.
    - The bottom button deletes the selected session from the app's internal files.
