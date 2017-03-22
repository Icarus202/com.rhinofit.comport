// JavaScript source code
chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('window.html', {
        'outerBounds': {
            'width': 400,
            'height': 500
        }
    });
});

var showDevices = function (ports) {
    for (var i = 0; i < ports.length; i++) {
        console.log(ports[i].path);
    }
    port.postMessage({
        type: "BACKGROUND",
        callback: "showDevices",
        response: ports
    });
}
//chrome.serial.getDevices(onGetDevices);

var port = null;
chrome.runtime.onConnect.addListener(function (messenger) {
    port = messenger;
    console.log(port);
    port.onMessage.addListener(function (request, sender) {
        if (request['action'] == "getDevices") {
            chrome.serial.getDevices(showDevices);
        } else if (request['action'] == "serialConnect") {
            chrome.serial.connect(request['data'], { bitrate: 9600 }, serialConnect);
            //add return connect command
        } else if (request['action'] == "sendMessage") {
            writeSerial(request['data']);
        } else if (request['action'] == "serialDisconnect") {
            chrome.serial.disconnect(serialPort.connectionId, serialDisconnect);
        } else {
            port.postMessage(testing_background());
        }
    });
});
//background needs messenger
function testing_background() {
    return {type: "BACKGROUND", text: "background works" };
}


var serialPort = null;
var serialConnect = function (connectionInfo) {
    serialPort = connectionInfo;
    console.log(serialPort);
}

var serialDisconnect = function(result) {
    if (result) {
        port.postMessage( {type: "BACKGROUND", text: "Disconnected from serial port" });
    } else {
        port.postMessage( {type: "BACKGROUND", text: "Disconnect failed" });
    }
}

var writeSerial = function (str) {
    chrome.serial.send(serialPort.connectionId, convertStringToArrayBuffer(str), onSend);
}
// Convert string to ArrayBuffer
var convertStringToArrayBuffer = function (str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

var onSend = function (e) {
    console.log(e);
}