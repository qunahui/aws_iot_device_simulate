const { DeviceModel } = require('./model/device');
const fields = require('./fields');
var awsIot = require('aws-iot-device-sdk');
require('dotenv').config({ path: `.env.${process.env.DEVICE_TYPE}` });

var deviceType = process.env.DEVICE_TYPE;
var clientId = process.env.CLIENT_ID;

const initDeviceData = {
  vID: clientId,
  deviceSerial: 'dmt_esocket_123456',
  deviceProfile: 'dmt_esocket_1sw',
  attributes: {
    hardware: '1.3.4',
    firmware: '1.6.2',
    manufacturer: 'OEM',
  },
  connection: {
    wifi: {
      status: 'connected',
      ssid: 'FOOMAP.ASIA',
      bssid: '67:AD:89:90',
      ip: '192.168.0.9',
      broadcast: '192.168.0.255',
      gw: '192.168.0.1',
    },
    cellularNetwork: {
      status: 'disconnected',
    },
    iot_broker: {
      status: 'connected',
    },
    iot_server: {
      status: 'disconnected',
    },
  },
  settings: {
    stateReportTimeout: 5000,
  },
  automation: [
    {
      _id: 0, // id of automation script
      type: 'period',
      enable: true,
      startTime: '17:00:00',
      endTime: '19:00:00',
      repeat: 'daily',
      action: [
        {
          switch0: 'on',
        },
      ],
    },
  ],
  fields: fields[deviceType],
};

var device = new DeviceModel(initDeviceData);
device.init();
setInterval(() => {
  device.simulateData();
}, 5000);

const deviceTopics = [
  `demeter/things/${clientId}/get`,
  `demeter/things/${clientId}/set`,
  `demeter/things/${clientId}/telemetry/update/accepted`,
  `demeter/things/${clientId}/telemetry/update/rejected`,
];

var thingShadows = awsIot.thingShadow({
  keyPath: process.env.AWS_PRIVATE_KEY_PATH,
  certPath: process.env.AWS_CERT_PATH,
  caPath: process.env.AWS_CA_PATH,
  clientId: process.env.CLIENT_ID,
  host: process.env.AWS_HOST,
});

var clientTokenUpdate;

thingShadows.on('connect', function () {
  console.log(`client-${clientId} connected to AWS`);

  thingShadows.subscribe(deviceTopics, (err, granted) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(granted);
    }
  });

  thingShadows.register(clientId, {}, function () {
    console.log(`shadow-${clientId} is registered`);

    clientTokenUpdate = device.reportDeviceState(thingShadows);

    if (true) {
      setInterval(() => {
        device.reportDeviceState(thingShadows);
      }, device.settings.stateReportTimeout);
    }
  });
});

thingShadows.on('message', function (topic, payload) {
  // console.log("message", topic, payload.toString());
  const topics = topic.split('/');
  console.log(topics);

  if (
    topics.length >= 4 &&
    topics[0] == 'demeter' &&
    topics[1] == 'things' &&
    topics[2] == clientId
  ) {
    switch (topics[3]) {
      case 'get':
        {
          device.handleGet(thingShadows, payload);
        }
        break;
      case 'set':
        {
          device.handleSet(thingShadows, payload);
        }
        break;
      default:
        break;
    }
  }
});

thingShadows.on('status', function (thingName, stat, clientToken, stateObject) {
  console.log(
    'received ' + stat + ' on ' + thingName + ': ' + JSON.stringify(stateObject)
  );
  console.log(clientToken);
});

thingShadows.on('delta', function (thingName, stateObject) {
  // console.log(
  //   "received delta on " + thingName + ": " + JSON.stringify(stateObject)
  // );
  device.deltaUpdate(thingShadows, stateObject);
  device.reportDeviceState(thingShadows);
});

thingShadows.on('timeout', function (thingName, clientToken) {
  console.log(
    'received timeout on ' + thingName + ' with token: ' + clientToken
  );
});
