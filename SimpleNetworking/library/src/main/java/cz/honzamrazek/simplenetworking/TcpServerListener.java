package cz.honzamrazek.simplenetworking;

import java.net.InetAddress;

public interface TcpServerListener {
    void onClient(InetAddress client);
    void onData(InetAddress client, String data);
    void onConnectError(String message);
    void onReceiveError(InetAddress client, String message);
    void onSendError(InetAddress client, String message);
}
