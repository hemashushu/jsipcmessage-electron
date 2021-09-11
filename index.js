const ElectronBackendIPC = require('./src/electronbackendipc');
const ElectronClientWindowIPC = require('./src/electronclientwindowipc');
const ElectronClientWindowMessageSender = require('./src/electronclientwindowmessagesender');

module.exports = {
    ElectronBackendIPC: ElectronBackendIPC,
    ElectronClientWindowIPC: ElectronClientWindowIPC,
    ElectronClientWindowMessageSender: ElectronClientWindowMessageSender,
};
