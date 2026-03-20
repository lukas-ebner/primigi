const CMD_TEXT = 0x33;

// Animation modes (sent via cmd 0x34)
export const ANIMATION_MODES = [
  { value: 1, label: "Laser" },
  { value: 2, label: "Pacman" },
  { value: 3, label: "Schneeflocke" },
  { value: 4, label: "Runter" },
  { value: 5, label: "Hoch" },
  { value: 6, label: "Rechts" },
  { value: 7, label: "Links" },
  { value: 8, label: "Statisch" },
];

function toHex(n: number): string {
  return n.toString(16).padStart(2, "0");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Text packet: FE 33 [len=chars+1] [dir=00] [chars...] [checksum] */
export function encodeText(text: string): Uint8Array {
  const chars = Array.from(text).map((c) => c.charCodeAt(0));
  const length = chars.length + 1;
  const direction = 0;
  const checksum =
    (256 -
      ((CMD_TEXT + length + direction + chars.reduce((a, b) => a + b, 0)) %
        256)) %
    256;

  let hex =
    toHex(0xfe) + toHex(CMD_TEXT) + toHex(length) + toHex(direction);
  for (const c of chars) hex += toHex(c);
  hex += toHex(checksum);
  return hexToBytes(hex);
}

/**
 * Generic command packet: FE [cmd] [len=data.length] [data...] [checksum]
 * Used for brightness (0x31), mode (0x34), on/off (0x36), speed (0x39), query (0x3D)
 */
export function encodeCommand(cmd: number, data: number[]): Uint8Array {
  const length = data.length;
  const checksum =
    (256 - ((cmd + length + data.reduce((a, b) => a + b, 0)) % 256)) % 256;

  let hex = toHex(0xfe) + toHex(cmd) + toHex(length);
  for (const b of data) hex += toHex(b);
  hex += toHex(checksum);
  return hexToBytes(hex);
}

async function sendBytes(
  characteristic: BluetoothRemoteGATTCharacteristic,
  data: Uint8Array
): Promise<void> {
  const CHUNK = 20;
  for (let i = 0; i < data.length; i += CHUNK) {
    await characteristic.writeValue(data.slice(i, i + CHUNK));
    if (i + CHUNK < data.length) await new Promise((r) => setTimeout(r, 30));
  }
}

export async function sendTextToShoe(
  characteristic: BluetoothRemoteGATTCharacteristic,
  text: string
): Promise<void> {
  await sendBytes(characteristic, encodeText(text));
}

export async function sendAnimationMode(
  characteristic: BluetoothRemoteGATTCharacteristic,
  mode: number // 1–8
): Promise<void> {
  await sendBytes(characteristic, encodeCommand(0x34, [mode]));
}

export async function sendBrightness(
  characteristic: BluetoothRemoteGATTCharacteristic,
  value: number // 0–8 based on app UI
): Promise<void> {
  await sendBytes(characteristic, encodeCommand(0x31, [value]));
}

export async function sendSpeed(
  characteristic: BluetoothRemoteGATTCharacteristic,
  value: number
): Promise<void> {
  await sendBytes(characteristic, encodeCommand(0x39, [value]));
}
