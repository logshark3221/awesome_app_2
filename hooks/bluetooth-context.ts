import { createContext, useContext } from 'react';
import { ParsedPacket } from './packet-parser';

export const BluetoothContext = createContext<{
    latestPacket: ParsedPacket | null;
}>({
    latestPacket: null,
});

export const useBluetoothContext = () => useContext(BluetoothContext);