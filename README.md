# co2mon

CO2 Monitor Connector for Node

This project is heavily influenced by [dmage/co2mon](https://github.com/dmage/co2mon), [kdudkov/co2mon](https://github.com/kdudkov/co2mon), [vfilimonov/co2meter](https://github.com/vfilimonov/co2meter) and could be considered as a port of `co2mon` for Node.

Tested on Mini CO2 Monitor (MT8057s), Holtek Semiconductor, Inc. USB-zyTemp.

## Getting Started

```bash
# npm
npm i co2mon

# yarn
yarn add co2mon
```

### Read CO2

```javascript
const { connect } = require('co2mon');

async function usingPromise() {
  const { getCO2, disconnect } = connect();

  const co2 = await getCO2();
  console.log(co2);

  disconnect();
}

function viaEvent() {
  const { emitter, disconnect } = connect();

  emitter.once('co2', (co2) => {
    console.log(co2);
    disconnect();
  });
}
```
