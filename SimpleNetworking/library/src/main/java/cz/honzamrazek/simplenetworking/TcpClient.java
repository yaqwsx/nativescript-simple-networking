package cz.honzamrazek.simplenetworking;

import java.io.IOException;
import java.net.Socket;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TcpClient {
    private TcpClientListener mListener;
    private ExecutorService mExecutor;
    private Socket mSocket;
    private byte[] mBuffer;

    TcpClient(Socket socket, TcpClientListener listener) {
        mListener = listener;
        mSocket = socket;
        mExecutor = Executors.newFixedThreadPool(2);
        mBuffer = new byte[8 * 1024 * 1024];
        receive();
    }

    public TcpClient(TcpClientListener listener) {
        mListener = listener;
        mExecutor = Executors.newFixedThreadPool(2);
        mBuffer = new byte[8 * 1024 * 1024];
    }

    Socket getNativeSocket() {
        return mSocket;
    }

    public void start(final String serverName, final int port) {
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket = new Socket(serverName, port);
                    receive();
                } catch (IOException e) {
                    mListener.onConnectError(e.getMessage());
                }
            }
        });
    }

    public void stop() {
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket.close();
                } catch (IOException e) {
                    mListener.onConnectError(e.getMessage());
                }

            }
        });
    }

    public void send(final String data) {
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket.getOutputStream().write(data.getBytes());
                } catch (IOException e) {
                    mListener.onSendError(e.getMessage());
                }
            }
        });
    }

    private void receive() {
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    int size = mSocket.getInputStream().read(mBuffer);
                    byte [] sub = Arrays.copyOfRange(mBuffer, 0, size);
                    String data = new String(sub);
                    mListener.onData(data);
                } catch (IOException e) {
                    mListener.onReceiveError(e.getMessage());
                }
                receive();
            }
        });
    }
}
