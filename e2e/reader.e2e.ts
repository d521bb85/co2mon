import { connect } from '../src';

jest.setTimeout(100000);

describe('reader', () => {
  it('reads co2 and temperature values', async () => {
    const { read, disconnect } = connect();
    const values = await read();

    console.log(values);

    disconnect();
  });
});
