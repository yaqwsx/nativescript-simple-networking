package cz.honzamrazek.simplenetworking;

import java.net.InetAddress;

public interface UdpListener {
    void onPacket(InetAddress sender, String data);
    void onFinished(int id);
    void onError(int id, String message);
}
