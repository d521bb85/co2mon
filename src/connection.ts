import { EventEmitter } from 'events';
import { HID } from 'node-hid';
import TypedEventEmitter from 'typed-emitter';
import { decode, FrameType } from './decoder';

export interface Connection {
  emitter: Emitter;
  getCO2: () => Promise<number>;
  getTemperature: () => Promise<number>;
  disconnect: () => void;
}

export type Emitter = TypedEventEmitter<Events>;

export type Events = {
  error: (error: any) => void;
  disconnect: () => void;
  co2: (value: number) => void;
  temperature: (value: number) => void;
};

const FRAME_TO_EVENT_MAPPING = {
  [FrameType.CO2]: 'co2',
  [FrameType.TEMPERATURE]: 'temperature'
} as const;

export function connect(): Connection {
  const device = openDevice();
  const emitter: Emitter = new EventEmitter();
  let connected = true;

  tick();

  function tick() {
    if (!connected) {
      return;
    }

    device.read((error, frame) => {
      if (error) {
        emitter.emit('error', error);
        return;
      }

      const message = decode(frame);

      if (message) {
        const [frameType, value] = message;
        const eventName = FRAME_TO_EVENT_MAPPING[frameType];

        emitter.emit(eventName, value);
      }

      tick();
    });
  }

  const getCO2 = waitFor('co2');

  const getTemperature = waitFor('temperature');

  function waitFor(name: 'co2' | 'temperature'): () => Promise<number> {
    return () =>
      new Promise((resolve, reject) => {
        emitter.once(name, (value) => resolve(value));
        emitter.once('error', (error) => reject(error));
      });
  }

  function disconnect() {
    connected = false;
    emitter.emit('disconnect');
    device.close();
  }

  return { emitter, getCO2, getTemperature, disconnect };
}

const HID_VENDOR_ID = 0x04d9;

const HID_PRODUCT_ID = 0xa052;

function openDevice() {
  try {
    const device = new HID(HID_VENDOR_ID, HID_PRODUCT_ID);
    device.sendFeatureReport(Buffer.alloc(8));
    return device;
  } catch {
    throw new Error(
      `Cannot open connection to CO2 Monitor (vid: ${HID_VENDOR_ID}, pid: ${HID_PRODUCT_ID})`
    );
  }
}
