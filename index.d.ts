import { Address4 } from "ip-address";
export declare class UdpServer {
    private server;
    onPacket: {
        (sender: Address4, packet: string): void;
    };
    onSetupError: {
        (message: string): void;
    };
    onReceiveError: {
        (message: string): void;
    };
    onSendError: {
        (message: string): void;
    };
    constructor();
    start(port: number): void;
    stop(): void;
}
