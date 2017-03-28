package cz.honzamrazek.simplenetworking;

import java.io.IOException;
import java.net.Socket;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class TcpClient {
    private TcpClientListener mListener;
    private ExecutorService mExecutor;
    private Socket mSocket;
    private byte[] mBuffer;
    private AtomicInteger mId;

    TcpClient(Socket socket, AtomicInteger id, TcpClientListener listener) {
        mListener = listener;
        mSocket = socket;
        mId = id;
        mExecutor = Executors.newFixedThreadPool(2);
        mBuffer = new byte[8 * 1024 * 1024];
        receive();
    }

    public TcpClient(TcpClientListener listener) {
        mListener = listener;
        mExecutor = Executors.newFixedThreadPool(2);
        mBuffer = new byte[8 * 1024 * 1024];
        mId = new AtomicInteger();
    }

    Socket getNativeSocket() {
        return mSocket;
    }

    public int start(final String serverName, final int port) {
        final int id = mId.getAndIncrement();
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket = new Socket(serverName, port);
                    receive();
                    mListener.onFinished(id);
                } catch (IOException e) {
                    mListener.onError(id, e.getMessage());
                }
            }
        });
        return id;
    }

    public int stop() {
        final int id = mId.getAndIncrement();
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket.close();
                    mListener.onFinished(id);
                } catch (IOException e) {
                    mListener.onError(id, e.getMessage());
                }

            }
        });
        return id;
    }

    public int send(final String data) {
        final int id = mId.getAndIncrement();
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket.getOutputStream().write(data.getBytes());
                    mListener.onFinished(id);
                } catch (IOException e) {
                    mListener.onError(id, e.getMessage());
                }
            }
        });
        return id;
    }

    private void receive() {
        final int id = mId.getAndIncrement();
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    int size = mSocket.getInputStream().read(mBuffer);
                    byte [] sub = Arrays.copyOfRange(mBuffer, 0, size);
                    String data = new String(sub);
                    mListener.onData(data);
                } catch (IOException e) {
                    mListener.onError(id, e.getMessage());
                }
                receive();
            }
        });
    }
}
