const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const { AbstractClientWindowMessageSender } = require('jsipcmessage');

class ElectronClientWindowMessageSender extends AbstractClientWindowMessageSender {
    constructor() {
        super();
    }

    /**
     * 获取 BrowserWindow 对应的 webContents 对象
     * @param {*} clientWindow
     * @returns
     */
    getSenderByClientWindow(clientWindow) {
        return clientWindow.webContents;
    }

    /**
     * 通过 webContents 获取 BrowserWindow
     *
     * @param {*} sender
     * @returns 如果没有对应的 client window （比如已经关闭/退出），则
     *     返回 null。
     */
    getClientWindowBySender(sender) {
        // sender 即 webContents 对象
        //
        // 历史遗留问题：
        // 在 Electron 7.x 及更早的版本，当 webContents 对象对应的 BrowserWindow
        // 不存在时，返回 undefined。
        // 从 Electron 8.0 版本开始返回 null。
        //
        // https://github.com/electron/electron/pull/19983)
        // http://electron.atom.io/docs/api/browser-window/#browserwindowfromwebcontentswebcontents
        return BrowserWindow.fromWebContents(sender);
    }

    /**
     * 通过 window id 获取 BrowserWindow 对象。
     *
     * @param {*} clientWindowId int 整型
     * @returns 如果没有对应的 client window，则返回 null。
     */
    getClientWindowById(clientWindowId) {
        // see also:
        // https://www.electronjs.org/docs/api/browser-window#browserwindowfromidid
        return BrowserWindow.fromId(clientWindowId);
    }

    /**
     * 通过 window id 获取 sender/receiver 对象。
     *
     * @param {*} clientWindowId int 整型
     * @returns 如果没有对应的 client window，则返回 null。
     */
    getSenderByClientWindowId(clientWindowId) {
        let clientWindow = this.getClientWindowById(clientWindowId);
        if (clientWindow === null) {
            return null;
        }

        return this.getSenderByClientWindow(clientWindow);
    }
}

module.exports = ElectronClientWindowMessageSender;

