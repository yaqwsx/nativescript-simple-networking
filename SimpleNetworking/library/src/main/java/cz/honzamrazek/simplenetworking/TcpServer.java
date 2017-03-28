package cz.honzamrazek.simplenetworking;

import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class TcpServer {
    private TcpServerListener mListener;
    private ExecutorService mExecutor;
    private ConcurrentHashMap<InetAddress, TcpClient> mClients;
    private ServerSocket mServer;
    private int mMaxClients;
    private AtomicBoolean mIsAccepting;
    private AtomicInteger mId;

    public TcpServer(int maxClients, TcpServerListener listener) {
        mMaxClients = maxClients;
        mListener = listener;
        mExecutor = Executors.newFixedThreadPool(maxClients + 2);
        mClients = new ConcurrentHashMap<>();
        mIsAccepting = new AtomicBoolean(false);
        mId = new AtomicInteger();
    }

    ServerSocket getNativeSocket() {
        return mServer;
    }

    TcpClient getClient(InetAddress c) {
        return mClients.get(c);
    }

    public int start(final int port) {
        final int id = mId.getAndIncrement();
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mServer = new ServerSocket(port);
                    mListener.onFinished(id);
                } catch (IOException e) {
                    mListener.onError(id, null, e.getMessage());
                }
                accept();
            }
        });
        return id;
    }

    public int stop() {
        int id = mId.getAndIncrement();
        try {
            mServer.close();
            for (TcpClient c : mClients.values()) {
                c.stop();
            }
            mListener.onFinished(id);
        } catch (IOException e) {
            mListener.onError(id, null, e.getMessage());
        }
        return id;
    }

    public int send(final InetAddress client, final String data) {
        TcpClient c = mClients.get(client);
        if (c == null) {
            int id = mId.getAndIncrement();
            mListener.onError(id, client, "No such client");
        }
        return c.send(data);
    }

    private void accept() {
        final int id = mId.getAndIncrement();
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                if (mIsAccepting.get() || mMaxClients == mClients.size())
                    return;
                mIsAccepting.set(true);
                try {
                    Socket s = mServer.accept();
                    final InetAddress address = s.getInetAddress();
                    TcpClient c = new TcpClient(s, mId, new TcpClientListener() {
                        @Override
                        public void onData(String data) {
                            mListener.onData(address, data);
                        }

                        @Override
                        public void onError(int id, String message) {
                            mListener.onError(id, address, message);
                        }

                        @Override
                        public void onFinished(int id) {
                            mListener.onFinished(id);
                        }
                    });
                    mClients.put(s.getInetAddress(), c);
                    mListener.onClient(s.getInetAddress());
                } catch (IOException e) {
                    mListener.onError(id, null, e.getMessage());
                } finally {
                    mIsAccepting.set(false);
                }
            };
        });
    }
}
