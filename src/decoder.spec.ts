import { decode, MessageType } from './decoder';

describe('decoder', () => {
  it('decodes temperature', () => {
    const input = Buffer.from('XaQyts+anPg=', 'base64');
    expect(decode(input)).toEqual([MessageType.TEMPERATURE, 24.1625]);
  });

  it('decodes co2', () => {
    const input = Buffer.from('faSitlaanBA=', 'base64');
    expect(decode(input)).toEqual([MessageType.CO2, 889]);
  });

  it('returns undefined when decoding of a message of an unknown type attempted', () => {
    const input = Buffer.from('YKSKt5CanCA=', 'base64');
    expect(decode(input)).toEqual(undefined);
  });
});
