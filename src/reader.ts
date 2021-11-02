import { HID } from 'node-hid';
import { decode, MessageType } from './decoder';

const HID_VENDOR_ID = 0x04d9;

const HID_PRODUCT_ID = 0xa052;

export function connect() {
  const device = openDevice();
  let welcomeMessageSent = false;

  function ensureWelcomeMessageSent() {
    if (!welcomeMessageSent) {
      device.sendFeatureReport(Buffer.alloc(8));
    }
  }

  async function read() {
    ensureWelcomeMessageSent();

    let co2: number | undefined;
    let temperature: number | undefined;

    function handleMessage([type, value]: [MessageType, number]) {
      console.log(type);

      switch (type) {
        case MessageType.CO2:
          co2 = value;
          break;

        case MessageType.TEMPERATURE:
          temperature = value;
          break;
      }
    }

    function scan() {
      return new Promise((resolve, reject) => {
        device.read((error, data) => {
          if (error) {
            reject(error);
            return;
          }

          const message = decode(data);

          if (message) {
            handleMessage(message);
          }

          resolve(undefined);
        });
      });
    }

    while (co2 === undefined || temperature === undefined) {
      await scan();
    }

    return {
      co2,
      temperature,
      date: new Date()
    };
  }

  function disconnect() {
    device.close();
  }

  return { read, disconnect };
}

function openDevice() {
  try {
    return new HID(HID_VENDOR_ID, HID_PRODUCT_ID);
  } catch {
    throw new Error(
      `Cannot open connection to CO2 Monitor Device (vid: ${HID_VENDOR_ID}, pid: ${HID_PRODUCT_ID})`
    );
  }
}
