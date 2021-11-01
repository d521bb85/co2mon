import { HID } from 'node-hid';

describe('hid', () => {
  it('finds a co2 meter device', () => {
    const device = new HID(0x04d9, 0xa052);
  });
});
