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
                constructor(port: number, listener: cz.honzamrazek.simplenetworking.UdpListener);
                stop?(): void;
                send?(address: java.net.InetAddress, packet: string): void;
            }
        }
    }
}


export class UdpServer {
    private server : cz.honzamrazek.simplenetworking.UdpServer;
    public onPacket: {(sender: java.net.InetAddress, packet: string): void;};
    public onString: {(message: string): void;};

    constructor(port: number) {
        var self = this;
        var listener = new cz.honzamrazek.simplenetworking.UdpListener({
            onPacket: (sender, packet) => {
                console.log("Message: ", packet);
            },
            onSetupError: (message: string) => {
                console.log("Error: ", message);
            },
            onReceiveError: (message: string) => {
                console.log("Error: ", message);
            },
            onSendError: (message: string) => {
                console.log("Error: ", message);
            }
        });
        this.server = new cz.honzamrazek.simplenetworking.UdpServer(port, listener);
    }

    public stop(): void {
        this.server.stop();
    }
}
