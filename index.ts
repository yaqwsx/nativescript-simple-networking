declare module cz {
    export module honzamrazek {
        export module simplenetworking {
            interface IUdpListener {
                onPacket?(sender: java.net.InetAddress, packet: string): void;
                onFinished?(id: number): void;
                onError?(id: number, message: string): void;
            }

            export class UdpListener {
                constructor(implementation: IUdpListener);
                onPacket?(sender: java.net.InetAddress, packet: string): void;
                onFinished?(id: number): void;
                onError?(id: number, message: string): void;
            }

            export class UdpServer {
                constructor(listener: cz.honzamrazek.simplenetworking.UdpListener);
                start?(port: number): number;
                stop?(): void;
                send?(address: java.net.InetAddress, packet: string): number;
                getNativeSocket(): java.net.DatagramSocket;
            }

            interface ITcpClientListener {
                onData(data: string): void;
                onConnectError(message: string): void;
                onReceiveError(message: string): void;
                onSendError(messgae: string): void;
            }

            export class TcpClientListener {
                constructor(implementation: ITcpClientListener);
                onData(data: string): void;
                onConnectError(message: string): void;
                onReceiveError(message: string): void;
                onSendError(messgae: string): void;
            }

            export class TcpClient {
                constructor(listener: cz.honzamrazek.simplenetworking.TcpClientListener);
                start(serverName: string, port: number): void;
                stop(): void;
                send(data: string): void;
                getNativeSocket(): java.net.Socket;
            }

            interface ITcpServerListener {
                onClient(client: java.net.InetAddress): void;
                onData(client: java.net.InetAddress, data: string): void;
                onConnectError(message: string): void;
                onReceiveError(client: java.net.InetAddress, message: string): void;
                onSendError(client: java.net.InetAddress, messgae: string): void;
            }

            export class TcpServerListener {
                constructor(listener: cz.honzamrazek.simplenetworking.TcpServerListener);
                onClient(client: java.net.InetAddress): void;
                onData(client: java.net.InetAddress, data: string): void;
                onConnectError(message: string): void;
                onReceiveError(client: java.net.InetAddress, message: string): void;
                onSendError(client: java.net.InetAddress, messgae: string): void;
            }

            export class TcpServer {
                constructor(listener: cz.honzamrazek.simplenetworking.TcpServerListener);
                start(port: number): void;
                stop(): void;
                send(client: java.net.InetAddress, data: string): void;
                getNativeSocket(): java.net.ServerSocket;
                getClient(client: java.net.InetAddress): cz.honzamrazek.simplenetworking.TcpClient;
            }
        }
    }
}

import {Address4} from "ip-address";

export class UdpServer {
    private server: cz.honzamrazek.simplenetworking.UdpServer;
    public onPacket: {(sender: Address4, packet: string): void;};
    public onError: {(id: number, message: string): void;};
    public onFinished: {(id: number): void;};

    constructor() {
        var self = this;
        var listener = new cz.honzamrazek.simplenetworking.UdpListener({
            onPacket: (sender, packet) => {
                if (self.onPacket != null)
                    self.onPacket(new Address4(sender.getHostAddress()), packet);
            },
            onError: (id: number, message: string) => {
                if (self.onError != null)
                    self.onError(id, message);
            },
            onFinished: (id: number) => {
                if (self.onFinished != null)
                    self.onFinished(id);
            }
        });
        this.server = new cz.honzamrazek.simplenetworking.UdpServer(listener);
    }

    public start(port: number): void {
        this.server.start(port);
    }

    public stop(): void {
        this.server.stop();
    }

    public send(address: Address4, packet: string): void;
    public send(address: string, packet: string): void;
    public send(address: any, packet: string): void {
        var name: string;
        if (address && typeof address == "string")
            name = address;
        else
            name = address.address;
        console.log("Send invoked");
        this.server.send(java.net.InetAddress.getByName(name), packet);
        console.log("Send done");
    }

    public getNativeSocket(): java.net.DatagramSocket {
        return this.server.getNativeSocket();
    }
}

export class TcpClient {
    private client: cz.honzamrazek.simplenetworking.TcpClient;
    public onData: {(data: string): void;};
    public onConnectError: {(message: string): void;};
    public onReceiveError: {(message: string): void;};
    public onSendError: {(messgae: string): void;};

    constructor() {
        var self = this;
        var listener = new cz.honzamrazek.simplenetworking.TcpClientListener({
            onData: (data) => {
                if (self.onData != null)
                    self.onData(data);
            },
            onConnectError: (message: string) => {
                if (self.onConnectError != null)
                    self.onConnectError(message);
            },
            onReceiveError: (message: string) => {
                if (self.onReceiveError != null)
                    self.onReceiveError(message);
            },
            onSendError: (message: string) => {
                if (self.onSendError != null)
                    self.onSendError(message);
            }
        });
        this.client = new cz.honzamrazek.simplenetworking.TcpClient(listener);
    }

    public start(servername: string, port: number): void {
        this.client.start(servername, port);
    }

    public stop(): void {
        this.client.stop();
    }

    public send(data: string): void {
        this.client.send(data);
    }
}
