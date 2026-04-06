import useBLE from '@/hooks/use-BLE';
import { useEffect, useState } from "react";
import { BluetoothContextType } from "./bluetooth-context";
import { ParsedPacket, parsePacket } from "./packet-parser";


export function useBluetoothData(): BluetoothContextType {
  const {
    HazmatReads,
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    allDevices,
  } = useBLE();
  const [latestPacket, setLatestPacket] = useState<ParsedPacket | null>(null);
  const [history, setHistory] = useState<ParsedPacket[]>([]);

  useEffect(() => {
    if (!HazmatReads || HazmatReads === "[]") return;

    const parsed = parsePacket(HazmatReads);
    if (parsed) {
      setLatestPacket(parsed);
      setHistory(prev => {
        const updated = [...prev, parsed];
        return updated.slice(-50);
      });
    }
  }, [HazmatReads]);

  return {
    latestPacket,
    history,
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    allDevices,
  };
}
