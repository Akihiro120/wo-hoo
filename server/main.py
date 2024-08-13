import websockets;
import asyncio;
import json;

# addr
ip_addr = "127.0.0.1";
port = 8000;

clients = [];
user_names = [];

# add client
async def register_client(websocket, path):
    # connect client
    print("Client Connected: {0}".format(websocket.remote_address))
    client_name = await websocket.recv()
    clients.append(websocket);
    user_names.append(client_name);
    
    # send the list to all clients
    for client in clients:
        format = "members " + json.dumps(user_names);
        await client.send(format);

    # client events
    try:
        # receive msg
        while True:
            msg = await websocket.recv()
            print("Received Message from {0}: {1}".format(websocket.remote_address, msg));
            message_type, message_data = msg.split(" ", 1);
            # send the message to all clients
            if (message_type == "message"):
                for client in clients:
                    await client.send("message {0}".format(message_data));

    except websockets.ConnectionClosed:
        print("Client Disconnected: {0}".format(websocket.remote_address));
        index = clients.index(websocket);
        user_names.remove(user_names[index]);
        clients.remove(websocket);

        # update the client list for existing clients
        for client in clients:
            format = "members " + json.dumps(user_names);
            await client.send(format);

# server
async def server(websocket, path):
    await register_client(websocket, path);

def main():
    # create server
    print("Began Server at {0}:{1}".format(ip_addr, port));
    server_instance = websockets.serve(server, ip_addr, port);
    asyncio.get_event_loop().run_until_complete(server_instance);
    asyncio.get_event_loop().run_forever();

# call the main function
if __name__ == "__main__":
    main();
