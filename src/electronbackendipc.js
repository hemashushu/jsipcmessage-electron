const electron = require('electron');
const ipcMain = electron.ipcMain;

const { AbstractBackendIPC } = require('jsipcmessage');

const IPC_MESSAGE_CHANNEL_NAME = 'message';

class ElectronBackendIPC extends AbstractBackendIPC {
    constructor() {
        super();
        this.bindEvents();
    }

    send(receiver, messageName, messageData) {
        // receiver 是一个 webContent 对象

        // ipcMain:
        //
        // http://electron.atom.io/docs/api/ipc-renderer/
        // http://electron.atom.io/docs/api/ipc-main/
        // http://electron.atom.io/docs/api/remote/

        receiver.send(IPC_MESSAGE_CHANNEL_NAME, {
            name: messageName,
            data: messageData
        });
    }

    bindEvents() {
        // 从 client（即 BrowserWindow）接收到消息
        ipcMain.on(IPC_MESSAGE_CHANNEL_NAME, (event, message) => {

            // event object:
            // {
            //     sender: the message sender, which is a BrowserWindow.webContents object,
            //     returnValue: return a value will result sending message to sender by synchronous.
            // }

            let sender = event.sender;
            let messageName = message.name;
            let messageData = message.data;

            this.messageReceived(sender, messageName, messageData);
        });
    }
}

module.exports = ElectronBackendIPC;