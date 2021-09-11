const path = require('path');
const querystring = require('querystring');

const { app, BrowserWindow } = require('electron')

const { MessageServer,
    ClientWindowListMaintainer } = require('jsipcmessage');

const { ElectronBackendIPC,
    ElectronClientWindowMessageSender } = require('../../index');

function init() {
    this.clientWindowListMaintainer = new ClientWindowListMaintainer();
    this.clientWindowMessageSender = new ElectronClientWindowMessageSender();

    let electronBackendIPC = new ElectronBackendIPC();
    this.messageServer = new MessageServer(
        this.clientWindowListMaintainer,
        this.clientWindowMessageSender,
        electronBackendIPC);

    bindEvents();

    // 创建第一个窗口
    createWindow();
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 660,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // 获取第一个空位
    let windowNumber = this.clientWindowListMaintainer.getFirstAvailablePlaceholderIndex();
    if (windowNumber === -1) {
        // 没有空位，添加到窗口列表
        windowNumber = this.clientWindowListMaintainer.append(mainWindow);
    } else {
        // 替换 null 元素
        this.clientWindowListMaintainer.reuse(windowNumber, mainWindow);
    }

    mainWindow.on('closed', () => {
        this.clientWindowListMaintainer.release(windowNumber);
    });

    let windowId = mainWindow.id;
    let queryObject = {
        windowId: windowId
    };

    let keyValueString = querystring.stringify(queryObject);
    let hashString = '#' + keyValueString;

    let mainPagePath = path.join(__dirname, 'index.html');
    let urlString = 'file://' + mainPagePath + hashString;
    mainWindow.loadURL(urlString);

    // mainWindow.webContents.openDevTools();

    brocastWindowCreated(windowId);
}

app.on('ready', () => {
    init();
});

app.on('window-all-closed', function () {
    app.quit();
});

function brocastWindowCreated(windowId) {
    this.messageServer.broadcast('windowCreated', {
        windowId: windowId
    });
}

function sendWindowList(receiver) {
    let windows = this.clientWindowListMaintainer.getAllAvailableClientWindows();
    let windowIds = windows.map(item => item.id);
    this.messageServer.send(receiver, 'gotWindowList', {
        windowIds: windowIds
    });
}

function sendMessage(sender, windowId, textContent) {

    let senderClientWindow = this.clientWindowMessageSender.getClientWindowBySender(sender);
    let senderClientWindowId = senderClientWindow.id;

    let receiver = this.clientWindowMessageSender.getSenderByClientWindowId(windowId);
    this.messageServer.send(receiver, 'gotMessage', {
        windowId: senderClientWindowId,
        textContent: textContent
    });
}

function bindEvents() {

    // 绑定 IPC 消息

    this.messageServer.addEventListener('createWindow', () => {
        createWindow();
    });

    this.messageServer.addEventListener('listWindow', ({ sender }) => {
        sendWindowList(sender);
    });

    this.messageServer.addEventListener('sendMessage', ({sender, data}) => {
        sendMessage(sender, Number(data.windowId), data.textContent);
    });
}
