package cz.honzamrazek.simplenetworking;

import android.util.Log;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import cz.honzamrazek.simplenetworking.UdpListener;

public class UdpServer {
    private UdpListener mListener;
    private ExecutorService mExecutor;
    private DatagramSocket mSocket;
    private AtomicInteger mId;
    private byte[] mBuffer;

    public UdpServer(UdpListener listener) {
        mListener = listener;
        mId = new AtomicInteger();
    }

    public DatagramSocket getNativeSocket() {
        return mSocket;
    }

    public int start(final int port) {
        final int id = mId.getAndIncrement();
        mBuffer = new byte[64 * 1024 * 1024];
        mExecutor = Executors.newFixedThreadPool(2);
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket = new DatagramSocket(port);
                    mExecutor.submit(new Runnable() {
                        @Override
                        public void run() {
                            receiveDatagram();
                        }
                    });
                    mListener.onFinished(id);
                }
                catch(SocketException e) {
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
                if (mSocket == null)
                    return;
                mSocket.close();
                mSocket = null;
                mListener.onFinished(id);
            }
        });
        return id;
    }

    public int send(final InetAddress address, final String message) {
        final int id = mId.getAndIncrement();
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    byte[] buffer = message.getBytes();
                    DatagramPacket packet = new DatagramPacket(buffer, buffer.length,
                            address, mSocket.getLocalPort());
                    mSocket.send(packet);
                    mListener.onFinished(id);
                }
                catch(IOException e) {
                    mListener.onError(id, e.getMessage());
                }
            }
        });
        return id;
    }

    private void receiveDatagram() {
        final int id = mId.getAndIncrement();
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    DatagramPacket packet = new DatagramPacket(mBuffer, mBuffer.length);
                    mSocket.receive(packet);
                    byte [] sub = Arrays.copyOfRange(packet.getData(), 0, packet.getLength());
                    String data = new String(sub);
                    InetAddress address = packet.getAddress();
                    mListener.onPacket(address, data);
                    receiveDatagram();
                }
                catch (IOException e) {
                    mListener.onError(id, e.getMessage());
                }
            }
        });
    }
}