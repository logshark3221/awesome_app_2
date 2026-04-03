import { useEffect, useState } from "react";
import { ParsedPacket, parsePacket } from "./packet-parser";

export function useBluetoothData(HazmatReads: string) {
  const [latestPacket, setLatestPacket] = useState<ParsedPacket | null>(null);
  const [history, setHistory] = useState<ParsedPacket[]>([]);

  useEffect(() => {
    if (!HazmatReads) return;

    const parsed = parsePacket(HazmatReads);
    if (parsed) {
      setLatestPacket(parsed);
      setHistory(prev => {
        const updated = [...prev, parsed];
        return updated.slice(-50);
      });
    }
  }, [HazmatReads]); // 🔥 reacts to real updates instead of interval

  return { latestPacket, history };
}
