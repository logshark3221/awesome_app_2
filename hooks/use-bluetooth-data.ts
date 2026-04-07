import useBLE from '@/hooks/use-BLE';
import { useEffect, useState } from "react";
import { BluetoothContextType } from "./bluetooth-context";
import { generatePacket, ParsedPacket, parsePacket } from "./packet-parser";
const USE_BLUETOOTH = false; // True for bluetooth, false for emulator/web testing

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

  // Actual BT code
  useEffect(() => {
    if (!USE_BLUETOOTH) return;
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
  // Packet generation, no BT
  useEffect(() => {
    if (USE_BLUETOOTH) return;
    const interval = setInterval(() => {
      const raw = generatePacket();
      const parsed = parsePacket(raw);
      if (parsed) {
        setLatestPacket(parsed);
        setHistory(prev => {
          const updated = [...prev, parsed];
          // console.log(updated)
          return updated;
        })
      }
    }, 5000); // generate a new packet every 5000ms

    return () => clearInterval(interval);
  }, []);
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
