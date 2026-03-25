import { useEffect, useState } from "react";
import { generatePacket, ParsedPacket, parsePacket } from "./packet-parser";

export function useBluetoothData() {
  const [latestPacket, setLatestPacket] = useState<ParsedPacket | null>(null);

  // this generates random packets
  // replace and use parsePacket and setLatestPacket w/ real data
  useEffect(() => {
    const interval = setInterval(() => {
        const raw = generatePacket();
        const parsed = parsePacket(raw);
        if (parsed) setLatestPacket(parsed);
    }, 5000); // generate a new packet every 5000ms

    return () => clearInterval(interval);
  }, []);
  
  return { latestPacket };
}
