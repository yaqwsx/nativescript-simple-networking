/// <reference path="../tns-platform-declarations/android.d.ts" />
declare module cz {
    export module honzamrazek {
        export module simplenetworking {
            interface IUdpListener {
                onPacket(sender: java.net.InetAddress, packet: string): void;
                onFinished(id: number): void;
                onError(id: number, message: string): void;
            }

            export class UdpListener {
                constructor(implementation: IUdpListener);
                onPacket(sender: java.net.InetAddress, packet: string): void;
                onFinished(id: number): void;
                onError(id: number, message: string): void;
            }

            export class UdpServer {
                constructor(listener: cz.honzamrazek.simplenetworking.UdpListener);
                start(port: number): number;
                stop(): number;
                send(address: java.net.InetAddress, packet: string): number;
                getNativeSocket(): java.net.DatagramSocket;
            }

            interface ITcpClientListener {
                onData(data: string): void;
                onFinished(id: number): void;
                onError(id: number, message: string): void;
            }

            export class TcpClientListener {
                constructor(implementation: ITcpClientListener);
                onData(data: string): void;
                onFinished(id: number): void;
                onError(id: number, message: string): void;
            }

            export class TcpClient {
                constructor(listener: cz.honzamrazek.simplenetworking.TcpClientListener);
                start(serverName: string, port: number): number;
                stop(): number;
                send(data: string): number;
                getNativeSocket(): java.net.Socket;
            }

            interface ITcpServerListener {
                onClient(client: java.net.InetAddress): void;
                onData(client: java.net.InetAddress, data: string): void;
                onError(id: number, client: java.net.InetAddress, message: string): void;
                onFinished(id: number): void;
            }

            export class TcpServerListener {
                constructor(listener: cz.honzamrazek.simplenetworking.TcpServerListener);
                onClient(client: java.net.InetAddress): void;
                onData(client: java.net.InetAddress, data: string): void;
                onError(id: number, client: java.net.InetAddress, message: string): void;
                onFinished(id: number): void;
            }

            export class TcpServer {
                constructor(maxClients: number, listener: cz.honzamrazek.simplenetworking.TcpServerListener);
                start(port: number): number;
                stop(): number;
                send(client: java.net.InetAddress, data: string): number;
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
                if (self.onPacket !== null)
                    self.onPacket(new Address4(sender.getHostAddress()), packet);
            },
            onError: (id, message) => {
                if (self.onError !== null)
                    self.onError(id, message);
            },
            onFinished: (id) => {
                if (self.onFinished !== null)
                    self.onFinished(id);
            }
        });
        this.server = new cz.honzamrazek.simplenetworking.UdpServer(listener);
    }

    public start(port: number): number {
        return this.server.start(port);
    }

    public stop(): number {
        return this.server.stop();
    }

    public send(address: Address4, packet: string): number;
    public send(address: string, packet: string): number;
    public send(address: any, packet: string): number {
        var name: string;
        if (address && typeof address == "string")
            name = address;
        else
            name = address.address;
        return this.server.send(java.net.InetAddress.getByName(name), packet);
    }

    public getNativeSocket(): java.net.DatagramSocket {
        return this.server.getNativeSocket();
    }
}

export class TcpClient {
    private client: cz.honzamrazek.simplenetworking.TcpClient;
    public onData: {(data: string): void;};
    public onError: {(id: number, message: string): void;};
    public onFinished: {(id: number): void;};

    constructor() {
        var self = this;
        var listener = new cz.honzamrazek.simplenetworking.TcpClientListener({
            onData: (data) => {
                if (self.onData !== null)
                    self.onData(data);
            },
            onError: (id, message) => {
                if (self.onError !== null)
                    self.onError(id, message);
            },
            onFinished: (id) => {
                if (self.onFinished !== null)
                    self.onFinished(id);
            }
        });
        this.client = new cz.honzamrazek.simplenetworking.TcpClient(listener);
    }

    public start(servername: string, port: number): number {
        return this.client.start(servername, port);
    }

    public stop(): number {
        return this.client.stop();
    }

    public send(data: string): number {
        return this.client.send(data);
    }
}

export class TcpServer {
    private server: cz.honzamrazek.simplenetworking.TcpServer;
    public onClient: {(client: Address4): void;};
    public onData: {(client: Address4, data: string): void;};
    public onError: {(id: number, client: Address4, message: string): void;};
    public onFinished: {(id: number): void;};

    constructor(maxClients: number) {
        var self = this;
        var listener = new cz.honzamrazek.simplenetworking.TcpServerListener({
            onClient: (client) => {
                if (self.onClient !== null)
                    self.onClient(new Address4(client.getHostAddress()));
            },
            onData: (client, data) => {
                if (self.onData !== null)
                    self.onData(new Address4(client.getHostAddress()), data);
            },
            onError: (id, client, message) => {
                if (self.onError !== null)
                    self.onError(id, new Address4(client.getHostAddress()), message);
            },
            onFinished: (id) => {
                if (self.onFinished !== null)
                    self.onFinished(id);
            }
        });
        this.server = new cz.honzamrazek.simplenetworking.TcpServer(maxClients, listener);
    }

    public start(port: number): number {
        return this.server.start(port);
    }

    public stop(): number {
        return this.server.stop();
    }

    public send(client: Address4, data: string): number {
        return this.server.send(java.net.InetAddress.getByName(client.address),
            data);
    }
}

