package cz.honzamrazek.simplenetworking;

import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class TcpServer {
    private TcpServerListener mListener;
    private ExecutorService mExecutor;
    private ConcurrentHashMap<InetAddress, TcpClient> mClients;
    private ServerSocket mServer;
    private int mMaxClients;
    private AtomicBoolean mIsAccepting;

    public TcpServer(int maxClients, TcpServerListener listener) {
        mMaxClients = maxClients;
        mListener = listener;
        mExecutor = Executors.newFixedThreadPool(maxClients + 2);
        mClients = new ConcurrentHashMap<>();
        mIsAccepting.set(false);
    }

    ServerSocket getNativeSocket() {
        return mServer;
    }

    TcpClient getClient(InetAddress c) {
        return mClients.get(c);
    }

    public void start(final int port) {
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mServer = new ServerSocket(port);
                } catch (IOException e) {
                    mListener.onConnectError(e.getMessage());
                }
                accept();
            }
        });
    }

    public void stop() {
        try {
            mServer.close();
            for (TcpClient c : mClients.values()) {
                c.stop();
            }
        } catch (IOException e) {
            mListener.onConnectError(e.getMessage());
        }
    }

    public void send(final InetAddress client, final String data) {
        TcpClient c = mClients.get(client);
        if (c == null) {
            mListener.onSendError(client, "No such client");
        }
        c.send(data);
    }

    private void accept() {
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                if (mIsAccepting.get() || mMaxClients == mClients.size())
                    return;
                mIsAccepting.set(true);
                try {
                    Socket s = mServer.accept();
                    final InetAddress address = s.getInetAddress();
                    TcpClient c = new TcpClient(s, new TcpClientListener() {
                        @Override
                        public void onData(String data) {
                            mListener.onData(address, data);
                        }

                        @Override
                        public void onConnectError(String message) { }

                        @Override
                        public void onReceiveError(String message) {
                            mListener.onReceiveError(address, message);
                        }

                        @Override
                        public void onSendError(String message) {
                            mListener.onSendError(address, message);
                        }
                    });
                    mClients.put(s.getInetAddress(), c);
                    mListener.onClient(s.getInetAddress());
                } catch (IOException e) {
                    mListener.onConnectError(e.getMessage());
                } finally {
                    mIsAccepting.set(false);
                }
            };
        });
    }
}
