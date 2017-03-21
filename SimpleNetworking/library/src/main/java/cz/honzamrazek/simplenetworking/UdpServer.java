package cz.honzamrazek.simplenetworking;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import cz.honzamrazek.simplenetworking.UdpListener;

public class UdpServer {
    private UdpListener mListener;
    private ExecutorService mExecutor;
    private DatagramSocket mSocket;
    private byte[] mBuffer;

    public UdpServer(UdpListener listener) {
        mListener = listener;
    }

    public DatagramSocket getNativeSocket() {
        return mSocket;
    }

    public void start(final int port) {
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
                }
                catch(SocketException e) {
                    mListener.onSetupError(e.getMessage());
                }
            }
        });
    }

    public void stop() {
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                if (mSocket == null)
                    return;
                mSocket.close();
                mSocket = null;
            }
        });
    }

    public void send(final InetAddress address, final String message) {
        mExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    byte[] buffer = message.getBytes();
                    DatagramPacket packet = new DatagramPacket(buffer, buffer.length,
                            address, mSocket.getPort());
                    mSocket.send(packet);
                }
                catch(IOException e) {
                    mListener.onSendError(e.getMessage());
                }
            }
        });
    }

    private void receiveDatagram() {
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
                    mListener.onReceiveError(e.getMessage());
                }
            }
        });
    }
}