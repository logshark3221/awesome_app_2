export interface ParsedPacket {
  sequenceNum: number;
  parsedH2S: number;
  parsedO2: number;
  parsedCO: number;
  parsedCH4: number;
  parsedTemp: number;
}

let simSequence = 0;

// function that generates random packets
export function generatePacket(): string {
  simSequence += 1;
  // O2, CO, H2S, CH4, Temperature
  // const sensors = [1.11, 2.22, 3.33, 4.44, 5.55];
  // const sensors = Array.from({ length: 5 }, () => (Math.random() * 100).toFixed(2));
  const sensors = [(Math.random() * 5) + 18, (Math.random() * 50) + 0, (Math.random() * 1) + 0, (Math.random() * 4) + 0, (Math.random() * 3) + 72];
  const packet = `[${simSequence}, ${sensors.join(", ")}]`;
  // console.log("Generated packet:", packet);
  return packet;
}

// takes packet as string and parses data, should be able to use with real/simulated data
export function parsePacket(raw: string): ParsedPacket | null {
  const cleaned = raw.trim().replace(/^\[/, "").replace(/\]$/, "");
  const parts = cleaned.split(",").map((str) => str.trim());

  // home screen won't update if latest packet is null
  if (parts.length !== 6) return null;
  const values = parts.map(Number);
  if (values.some(isNaN)) return null;

  // console.log("Parsed packet:", { sequenceNum: values[0], parsedH2S: values[1], parsedO2: values[2], parsedCO: values[3], parsedCH4: values[4], parsedTemp: values[5] });
  return {
    sequenceNum: values[0],
    parsedO2: values[1],
    parsedCO: values[2],
    parsedH2S: values[3],
    parsedCH4: values[4],
    parsedTemp: values[5]
  };
}