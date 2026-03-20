const CMD_TEXT = 0x33;

function toHex(n: number): string {
  return n.toString(16).padStart(2, "0");
}

export function encodeText(text: string, leftToRight = true): Uint8Array {
  const chars = Array.from(text).map((c) => c.charCodeAt(0));
  const length = chars.length + 1;
  const direction = leftToRight ? 0 : 1;
  const checksum =
    (256 -
      ((CMD_TEXT +
        length +
        direction +
        chars.reduce((a, b) => a + b, 0)) %
        256)) %
    256;

  let hex =
    toHex(0xfe) +
    toHex(CMD_TEXT) +
    toHex(length) +
    toHex(direction);
  for (const c of chars) hex += toHex(c);
  hex += toHex(checksum);

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function sendTextToShoe(
  characteristic: BluetoothRemoteGATTCharacteristic,
  text: string,
  leftToRight = true
): Promise<void> {
  const data = encodeText(text, leftToRight);
  const CHUNK = 20;
  for (let i = 0; i < data.length; i += CHUNK) {
    await characteristic.writeValue(data.slice(i, i + CHUNK));
    await new Promise((r) => setTimeout(r, 30));
  }
}
