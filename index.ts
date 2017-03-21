declare module cz {
    export module honzamrazek {
        export module simplenetworking {
            interface IUdpListener {
                onPacket?(sender: java.net.InetAddress, packet: string): void;
                onSetupError?(message: string): void;
                onReceiveError?(message: string): void;
                onSendError?(message: string): void;
            }

            export class UdpListener {
                constructor(implementation: IUdpListener);
                onPacket?(sender: java.net.InetAddress, packet: string): void;
                onSetupError?(message: string): void;
                onReceiveError?(message: string): void;
                onSendError?(message: string): void;
            }

            export class UdpServer {
                constructor(listener: cz.honzamrazek.simplenetworking.UdpListener);
                start?(port: number): void;
                stop?(): void;
                send?(address: java.net.InetAddress, packet: string): void;
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
    private server : cz.honzamrazek.simplenetworking.UdpServer;
    public onPacket: {(sender: Address4, packet: string): void;};
    public onSetupError: {(message: string): void;};
    public onReceiveError: {(message: string): void;};
    public onSendError: {(message: string): void;};

    constructor() {
        var self = this;
        var listener = new cz.honzamrazek.simplenetworking.UdpListener({
            onPacket: (sender, packet) => {
                if (self.onPacket != null)
                    self.onPacket(new Address4(sender.getHostAddress()), packet);
            },
            onSetupError: (message: string) => {
                if (self.onSetupError != null)
                    self.onSetupError(message);
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
        this.server = new cz.honzamrazek.simplenetworking.UdpServer(listener);
    }

    public start(port: number): void {
        this.server.start(port);
    }

    public stop(): void {
        this.server.stop();
    }
}
