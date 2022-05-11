module.exports = {
  'dmt-ss-th': [
    {
      fkey: 'temperature',
      readonly: true,
      reportedVal: null,
      desiredVal: null,
    },
    {
      fkey: 'humidity',
      readonly: true,
      reportedVal: null,
      desiredVal: null,
    },
    {
      fkey: 'sensorStatus',
      readonly: false,
      reportedVal: 'ok',
      desiredVal: null,
    },
    {
      fkey: 'status',
      readonly: false,
      reportedVal: 'online',
      desiredVal: null,
    },
  ],
  'dmt-sw': [
    {
      fkey: 'switch',
      readonly: false,
      reportedVal: 'on',
      desiredVal: null,
    },
    {
      fkey: 'switchStatus',
      readonly: false,
      reportedVal: 'error',
      desiredVal: null,
    },
    {
      fkey: 'status',
      readonly: false,
      reportedVal: 'online',
      desiredVal: null,
    },
  ],
};
