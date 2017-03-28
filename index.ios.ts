import {Address4} from "ip-address";

export class UdpServer {
    public onPacket: {(sender: Address4, packet: string): void;};
    public onError: {(id: number, message: string): void;};
    public onFinished: {(id: number): void;};

    public start(port: number): number {
        throw "Not implemented";
    }

    public stop(): number {
        throw "Not implemented";
    }

    public send(address: Address4, packet: string): number;
    public send(address: string, packet: string): number;
    public send(address: any, packet: string): number {
        throw "Not implemented";
    }

    public getNativeSocket(): java.net.DatagramSocket {
        throw "Not implemented";
    }
}

export class TcpClient {
    public onData: {(data: string): void;};
    public onError: {(id: number, message: string): void;};
    public onFinished: {(id: number): void;};

    public start(servername: string, port: number): number {
        throw "Not implemented";    }

    public stop(): number {
        throw "Not implemented";
    }

    public send(data: string): number {
        throw "Not implemented";
    }
}

export class TcpServer {
    public onClient: {(client: Address4): void;};
    public onData: {(client: Address4, data: string): void;};
    public onError: {(id: number, client: Address4, message: string): void;};
    public onFinished: {(id: number): void;};

    public start(port: number): number {
        throw "Not implemented";
    }

    public stop(): number {
        throw "Not implemented";
    }

    public send(client: Address4, data: string): number {
        throw "Not implemented";
    }
}

