import { decode, FrameType } from './decoder';

describe('decoder', () => {
  it('decodes temperature', () => {
    const frame = Buffer.from('XaQyts+anPg=', 'base64');
    expect(decode(frame)).toEqual([FrameType.TEMPERATURE, 24.1625]);
  });

  it('decodes co2', () => {
    const frame = Buffer.from('faSitlaanBA=', 'base64');
    expect(decode(frame)).toEqual([FrameType.CO2, 889]);
  });

  it('returns undefined when decoding of a message of an unknown type attempted', () => {
    const frame = Buffer.from('YKSKt5CanCA=', 'base64');
    expect(decode(frame)).toEqual(undefined);
  });
});
