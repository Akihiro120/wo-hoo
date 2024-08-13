let socket = new WebSocket("wss://127.0.0.1");
let connected = false;
let member_list = document.getElementById("online_members");
let message_index = 0;

function on_connect() {
    // get the port and the ip
    let address = document.getElementById("ip_address_input").value;
    let port = document.getElementById("port_input_box").value;
    // if the port isn't empty
    if (port != "") {
        port = ":" + port;
    }

    // try to connect to the server
    socket = new WebSocket(`wss://${address}${port}`)

    // create the event listeners
    socket.addEventListener("open", (event) => {
        // connection to the server is successful
        console.log("Connected to the Server");
        connected = true;

        // send username to server
        let username = document.getElementById("user_name_input").value;
        socket.send(username);

        // update connection status
        update_connection_status();
    });

    socket.addEventListener("close", (event) => {
        // successfully disconnected from server
        console.log("Disconnected");
        connected = false;

        // update connection status
        update_connection_status();
    });

    socket.addEventListener("message", (event) => {
        // successfully received message
        receive_msg(event.data);
    });

    socket.addEventListener("error", (event) => {
        // error
        console.log(event.message);
    })
}

// disconnect 
function on_disconnect() {
    console.log("Disconnected")
    member_list.innerHTML = "";
    socket.close();
}

// update the clients connection status
function update_connection_status() {
    if (connected) {
        document.getElementById("connection_status").textContent = "Connection Status: Connected";
    } else {
        document.getElementById("connection_status").textContent = "Connection Status: Disconnected";
    }
}

function update() {
    // update these functions frequently
    check_connectability();
    check_sendability();
}
setInterval(update, 100);

// input for username and button connection
function check_connectability() {
    const msg_input = document.getElementById("user_name_input");
    if (msg_input.value != "" && !connected) {
        // enable connect button
        document.getElementById("connect_button_element").disabled = false;
    } else {
        // disable connect button
        document.getElementById("connect_button_element").disabled = true;
    }

    // disconnect button
    if (connected) {
        document.getElementById("disconnect_button_element").disabled = false;
        document.getElementById("user_name_input").disabled = true;
    } else {
        document.getElementById("disconnect_button_element").disabled = true;
        document.getElementById("user_name_input").disabled = false;
    }
}

// input for username and button connection
function check_sendability() {
    const msg_input = document.getElementById("send_msg_input");
    if (msg_input.value != "") {
        // enable connect button
        document.getElementById("send_msg_button").disabled = false;
    } else {
        // disable connect button
        document.getElementById("send_msg_button").disabled = true;
    }
}

function receive_msg(msg) {
    message = msg;
    const [received_type, ...received_data_array] = message.split(' ');
    const received_data = received_data_array.join(' ');

    if (received_type == "members") {
        console.log(JSON.parse(received_data));
        update_list(JSON.parse(received_data))
    }
    if (received_type == "message") {
        msg_clients(received_data);
    }
}

// recive message 
function msg_clients(msg) {
    let message_list = document.getElementById("messages");
    let li = document.createElement("li");
    if (message_index == 0) {
        message_index = 1;
        li.className = "msg1"
    } else {
        message_index = 0;
        li.className = "msg2"
    }
    li.appendChild(document.createTextNode(msg));
    message_list.appendChild(li);
}

// update member list
function update_list(list) {
    member_list.innerHTML = "";
    for (let i = 0; i < list.length; i++) {
        console.log(list[i]);

        let li = document.createElement("li");
        
        li.appendChild(document.createTextNode(list[i]));
        member_list.appendChild(li);
    }
}

// send
function on_send() {
    let username = document.getElementById("user_name_input").value;
    let send_msg = document.getElementById("send_msg_input").value;
    const now = new Date(); // Get the current date and time
    const hours = String(now.getHours()).padStart(2, '0'); // Get hours and pad with leading zero if needed
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero if needed
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero if needed
    let msg = (`message [${hours}:${minutes}:${seconds}] ${username}: ${send_msg}`);

    socket.send(msg);

    // clear the text
    document.getElementById("send_msg_input").value = "";
}

document.getElementById("send_msg_input").addEventListener("keydown", function(event) {
    if (event.key == "Enter" && document.getElementById("send_msg_input").value != "") {
        on_send();
    }
});