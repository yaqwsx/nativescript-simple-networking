package cz.honzamrazek.simplenetworking;

import java.net.InetAddress;

public interface UdpListener {
    void onPacket(InetAddress sender, String data);
    void onSetupError(String message);
    void onReceiveError(String message);
    void onSendError(String message);
}
