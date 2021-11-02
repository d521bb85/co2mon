import { HID } from 'node-hid';

describe('hid', () => {
  it('finds a co2 meter device', () => {
    const device = new HID(0x04d9, 0xa052);
    expect(device).toBeInstanceOf(HID);

    device.close();
  });

  it('responds with a data', () => {
    const device = new HID(0x04d9, 0xa052);

    device.sendFeatureReport(Buffer.alloc(8));

    return new Promise((resolve, reject) => {
      device.read((error, data) => {
        device.close();

        if (error) {
          reject(error);
          return;
        }

        expect(data).toBeInstanceOf(Buffer);
        resolve(undefined);
      });
    });
  });
});
