from pyray import *
from graphical import *
import threading;
import asyncio
import websockets

# server
IP = "10.12.162.43"
PORT = 12345;
console_log = [];
console_log_lock = threading.Lock();
window_closed = False;

clients = [];

async def handle_client(websocket, path):
    console_log.append(("Connected Client {0}".format(websocket.remote_address), WHITE))
    clients.append(websocket)

    try:
        await websocket.send("Server: Welcome!")
        while True:
            msg = await websocket.recv()
            console_log.append(("Received message from {0}: {1}".format(websocket.remote_address, msg), WHITE));

            for client in clients:
                try:
                    await client.send(msg)
                except Exception as e:
                    print(e);
    except websockets.ConnectionClosed:
        console_log.append(("Client {0} Disconnected".format(websocket.remote_address), WHITE))
        clients.remove(websocket);
        

async def handle_server():
    server = await websockets.serve(handle_client, IP, PORT);
    await server.wait_closed() 

def server():
    console_log.append(("WebSocket server is running on ws://{0}:{1}".format(IP, PORT), WHITE));
    asyncio.new_event_loop().run_until_complete(handle_server());

def main():
    init_window(800, 600, "Messaging Server");
    roboto = load_font_ex("Roboto-Light.ttf", 24, None, 0);

    server_thread = threading.Thread(target=server, args=());
    server_thread.start();

    while not window_should_close():
        # draw the gui
        graphical(console_log, roboto);

    close_window();
    server_thread.join();

if __name__ == "__main__":
    main()
