const querystring = require('querystring');

const { MessageClient } = require('jsipcmessage');
const { ElectronClientWindowIPC } = require('../../index');

function init() {
    let electronClientWindowIPC = new ElectronClientWindowIPC();
    this.messageClient = new MessageClient(electronClientWindowIPC);

    let hashString = window.location.hash;
    let keyValueString = hashString.substring(1);
    let queryObject = querystring.parse(keyValueString);
    showWindowId(queryObject.windowId);

    bindEvents();
}

function showWindowId(id) {
    let windowIdElement = document.querySelector('.window-id');
    windowIdElement.textContent = id;
}

function showMessage(text) {
    let messageElement = document.querySelector('.message');
    messageElement.textContent = text;
}

function showWindowList(windowIds) {
    let windowListElement = document.querySelector('.window-list');
    windowListElement.textContent = windowIds.join(',');
}

function sendCreateWindowRequest() {
    this.messageClient.send('createWindow');
}

function sendListWindowRequest() {
    this.messageClient.send('listWindow');
}

function sendMessage() {
    let windowIdTextInputElement = document.querySelector('input[name="window-id"]');
    let textContentTextInputElement = document.querySelector('input[name="text-content"]');

    let windowId = windowIdTextInputElement.value;
    let textContent = textContentTextInputElement.value;
    this.messageClient.send('sendMessage', {
        windowId: windowId,
        textContent: textContent
    });
}

function bindEvents() {

    // 绑定按钮的事件

    let createButtonElement = document.querySelector('input[name="create"]');
    createButtonElement.addEventListener('click', () => {
        sendCreateWindowRequest();
    });

    let listButtonElement = document.querySelector('input[name="list"]');
    listButtonElement.addEventListener('click', ()=>{
        sendListWindowRequest();
    });

    let sendButtonElement = document.querySelector('input[name="send"]');
    sendButtonElement.addEventListener('click', ()=>{
        sendMessage();
    });

    // 绑定 IPC 事件

    this.messageClient.addEventListener('windowCreated', (data) => {
        let windowId = data.windowId;
        showMessage('New window created, id: ' + windowId);
    });

    this.messageClient.addEventListener('gotWindowList', (data) => {
        let windowIds = data.windowIds;
        showWindowList(windowIds);
    });

    this.messageClient.addEventListener('gotMessage', (data) => {
        let {windowId, textContent} = data;
        showMessage(`Window ${windowId} say: ${textContent}`);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    init();
});