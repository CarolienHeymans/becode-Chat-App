//server side


//variables etc
const express = require('express');
const app = express();
let connections = [];
let userNames = [];
const server = require('http').Server(app);
const io = require('socket.io')(server);

//static ????
app.use(express.static('public'));
//listen on port 3000
server.listen(3000);
console.log("It's alive!");

// make connection to server +list all the connections by ID
io.on('connection', (socket) => {
    console.log('Hello =) Id: ' + socket.id)
    connections.push(socket.id);
    console.log(1, connections)

    //sign in: pick your username 
    socket.on('signin', (data) => {
        socket.username = data
        // console.log(data)
        // console.log(socket.username)
        userNames.push(data.username);
        updateUsers();
        console.log(3, connections, userNames);
    })

    //functions
    function updateUsers() {
        io.emit('usernames', userNames);
    };


    //join room + sending messages
    socket.on('joinRoom', (room) => {
        socket.join(room)
        console.log(socket.username.username + " succesfully joined " + room); //joined chatroom of choice
        //send a new message
        socket.on('new_message', (data) => {
            io.sockets.to(room).emit('new_message', {
                message: data.message,
                username: socket.username.username
            })

        })

        socket.on('typing', (data) => {
            io.to(room).emit('typing', {
                username: socket.username.username
            })
        })

    })
    socket.on('disconnect', () => {
        console.log(socket.username.username)
        userNames.splice(userNames.indexOf(socket.username.username), 1)
        connections.splice(connections.indexOf(socket.id), 1)
        console.log(5, connections, userNames)
        updateUsers();
        console.log('Goodbye')

    });
})