package cz.honzamrazek.simplenetworking;

public interface TcpClientListener {
    void onData(String data);
    void onConnectError(String message);
    void onReceiveError(String message);
    void onSendError(String message);
}
