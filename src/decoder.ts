const BYTES_TO_SWAP = [
  [0, 2],
  [1, 4],
  [3, 7],
  [5, 6]
];

const MAGIC_WORD = Buffer.from('Htemp99e');

export enum FrameType {
  TEMPERATURE = 0x42,
  CO2 = 0x50
}

export function decode(
  frame: Buffer | number[]
): [FrameType, number] | undefined {
  const buffer = Buffer.from(frame);

  for (const [a, b] of BYTES_TO_SWAP) {
    [buffer[a], buffer[b]] = [buffer[b], buffer[a]];
  }

  const firstByte = buffer[7];

  for (let index = 7; index > 0; --index) {
    buffer[index] = (buffer[index - 1] << 5) | (buffer[index] >> 3);
  }

  buffer[0] = (firstByte << 5) | (buffer[0] >> 3);

  for (let index = 0; index < 8; ++index) {
    buffer[index] -= (MAGIC_WORD[index] << 4) | (MAGIC_WORD[index] >> 4);
  }

  const key = buffer[0];
  const value = (buffer[1] << 8) + buffer[2];

  switch (key) {
    default:
      return undefined;

    case FrameType.CO2:
      return [FrameType.CO2, value];

    case FrameType.TEMPERATURE:
      return [FrameType.TEMPERATURE, convertTemperature(value)];
  }
}

function convertTemperature(value: number) {
  return Number((value * 0.0625 - 273.15).toFixed(4));
}
