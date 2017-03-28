package cz.honzamrazek.simplenetworking;

public interface TcpClientListener {
    void onData(String data);
    void onError(int id, String message);
    void onFinished(int id);
}
