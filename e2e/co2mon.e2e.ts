import { connect } from '../src';

describe('co2mon', () => {
  it('reads co2', async () => {
    const { getCO2, disconnect } = connect();
    expect(await getCO2()).toEqual(expect.any(Number));
    disconnect();
  });

  it('reads temperature', async () => {
    const { getTemperature, disconnect } = connect();
    expect(await getTemperature()).toEqual(expect.any(Number));
    disconnect();
  });
});
