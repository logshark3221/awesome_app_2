import { createContext, useContext } from 'react';
import { ParsedPacket } from './packet-parser';

export const BluetoothContext = createContext<{
    latestPacket: ParsedPacket | null;
    history: ParsedPacket[];
}>({
    latestPacket: null,
    history: [],
});

export const useBluetoothContext = () => useContext(BluetoothContext);