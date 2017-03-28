package cz.honzamrazek.simplenetworking;

import java.net.InetAddress;

public interface TcpServerListener {
    void onClient(InetAddress client);
    void onData(InetAddress client, String data);
    void onError(int id, InetAddress client, String message);
    void onFinished(int id);
}
