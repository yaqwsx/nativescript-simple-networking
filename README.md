# NativeScript Simple Networking

Basic UDP and TCP sockets for NativeScript.

## Supported platforms

- Android (any device with Android 4.4 and higher)

There is no support for iOS (yet), as I am not an iOS developer. Contributions
for adding iOS support are welcome!

## Installing

```
tns plugin add nativescript-simple-networking
```

## Usage

This plugin provides three classes: `UdpServer`, `TcpClient` and `TcpServer`.
All of them provide similar, callback-based, interface. An example of usage is
worth a thousands words and therefore here is a TypeScript example:

```js
import {UdpServer, TcpClient, TcpServer} from "nativescript-simple-networking";
import {Address4} from "ip-address";

var udpServer = new UdpServer();
udpServer.onPacket = (sender: Address4, message: string) => {
    console.log("Message from UDP: ", message);
};
udpServer.onError = (id: number, message: string) => {
    console.log("UDP error for action #", id, ": ", message);
};
udpServer.onFinished = (id: number) => {
    console.log("UDP finished action #", id);
};

// Start listening on port 33333
var udpConnectEvent: number = udpServer.start(33333);
console.log("UDP start event is: ", udpConnectEvent);
// Broadcast a message
var udpBroadcastEvent: number = udpServer.send("255.255.255.255", "I am alive!");
console.log("UDP broadcast event is: ", udpBroadcastEvent);

// Start a TCP server listening on port 44444 with maximum 2 clients
var tcpServer = new TcpServer(2);
tcpServer.onClient = (client: Address4) => {
    console.log("New TCP client: ", client.adddress)
    tcpServer.send(client, "Welcome!");
};
tcpServer.onData = (client: Address4, data: string) => {
    console.log("New data from client ", client.address, ": ", data);
};
tcpServer.onError = (id: number, client: Address4, message: string) => {
    if (client)
        console.log("TCP server client error", client.address, ": ", message);
    else
        console.log("TCP server error: ", message);
};
tcpServer.onFinished = (id: number) => {
        console.log("TCP server finished transaction #", id);
};

tcpServer.start(44444);

// Connect to the TCP server
var tcpClient = new TcpClient();
tcpClient.onData = (data: string) => {
    console.log("Data from TCP client: ", data);
};
tcpClient.onError = (id: number, message: string) => {
    console.log("TCP client error for action #", id, ": ", message);
};
tcpClient.onFinished = (id: number) => {
    console.log("TCP client finished action #: ", id);
};

// Connect client, action IDs are ommited in this example - see UdpServer
tcpClient.start("localhost", 44444);
tcpClient.send("I am also alive!");

// When we are finished
udpServer.stop();
tcpServer.stop();
tcpClient.stop();
```

## Contributing

Any contributions are welcome, feel free to submit a pull request on GitHub. I
would appreciate a PR, which would add support for iOS.

## Future Plans

- support iOS
- implement a wrapper for future-based interface

