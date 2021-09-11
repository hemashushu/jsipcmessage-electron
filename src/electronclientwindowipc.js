const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const IPC_MESSAGE_CHANNEL_NAME = 'message';

const { AbstractClientWindowIPC } = require('jsipcmessage');

class ElectronClientWindowIPC extends AbstractClientWindowIPC {
    constructor() {
        super();
        this.bindEvents();
    }

    send(messageName, messageData) {

        // ipcRenderer:
        //
        // ipcRenderer.send(channel[, arg1][, arg2][, ...])
        // ipcRenderer.sendSync(channel[, arg1][, arg2][, ...])
        //
        // http://electron.atom.io/docs/api/ipc-renderer/
        // http://electron.atom.io/docs/api/ipc-main/
        // http://electron.atom.io/docs/api/remote/

        ipcRenderer.send(IPC_MESSAGE_CHANNEL_NAME, {
            name: messageName,
            data: messageData
        });
    }

    bindEvents() {
        // 收到从主线程发送过来的消息
        ipcRenderer.on(IPC_MESSAGE_CHANNEL_NAME, (event, args) => {
            let messageName = args.name;
            let messageData = args.data;
            this.messageReceived(messageName, messageData);
        });
    }
}

module.exports = ElectronClientWindowIPC;