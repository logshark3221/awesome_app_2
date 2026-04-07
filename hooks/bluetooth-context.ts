import { createContext, useContext } from 'react';
import { Device } from 'react-native-ble-plx';
import { ParsedPacket } from './packet-parser';

export interface BluetoothContextType {
    latestPacket: ParsedPacket | null;
    history: ParsedPacket[];
    requestPermissions: () => Promise<boolean>;
    scanForPeripherals: () => void;
    connectToDevice: (device: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    connectedDevice: Device | null;
    allDevices: Device[];
}

export const BluetoothContext = createContext<BluetoothContextType>({
    latestPacket: null,
    history: [],
    requestPermissions: async () => false,
    scanForPeripherals: () => {},
    connectToDevice: async () => {},
    disconnectFromDevice: () => {},
    connectedDevice: null,
    allDevices: [],
});

export const useBluetoothContext = () => useContext(BluetoothContext);