let connected = false;
let server = new WebSocket("wss://127.0.0.1");

document.getElementById("connect-button").addEventListener("click", function() {
    const ip_input = document.getElementById("ip-input").value;
    const port_input = document.getElementById("port-input").value;

    if (!connected) {
        server = new WebSocket(`wss://${ip_input}:${port_input}`);
        server.onerror = function(event) {
            console.error("WebSocket error:", event);
        };

        server.onopen = function(event) {
            server.send("Client Joined");
            console.log("Connected to Server");
            connected = true;

            document.getElementById("connection-status").textContent = "STATUS: Connected";
        }

        server.onmessage = function(message) {
            //console.log(`Server Message: ${message.data}`);
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(message.data))
            document.getElementById("messages").appendChild(li);
        }

        server.onclose = function(event) {
            console.log("Server Disconnected");
            connected = false;
            document.getElementById("connection-status").textContent = "STATUS: Disconnected";
        }
    }
});

document.getElementById("disconnect-button").addEventListener("click", function() {
    if (connected) {
        const msg = document.getElementById("message").value;
        const username = document.getElementById("username").value;
        if (username == "") {
            username = "Client";
        }
        server.send(`${username} Disconnected`);
        server.close(1000, 'Client Disconnected');
    }
});

document.getElementById("send-button").addEventListener("click", function() {
    if (connected) {
        const msg = document.getElementById("message").value;
        const username = document.getElementById("username").value;
        if (username == "") {
            username = "Client";
        }
        server.send(`${username}: ${msg}`);

        document.getElementById("message").value = "";
    }
});