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
server.listen(process.env.PORT || 3000)
console.log("It's alive!");

// make connection to server +list all the connections by ID
io.on('connection', (socket) => {
    console.log(`New user connected =D! Id: ${socket.id}`)
    connections.push(socket.id);

    //sign in: pick your username 
    socket.on('signin', (data) => {
        socket.username = data
        userNames.push(data.username);
        updateUsers();
        console.log(`connected users: ID: ${connections}, Names: ${userNames}`);
    })
    //function updateUsers to update the userlist (when people join and leave)
    function updateUsers() {
        io.emit('usernames', userNames);
    };


    //join room + sending messages to that room
    socket.on('joinRoom', (room) => {
        socket.join(room)
        console.log(`Welcome to the ${room} chat, ${socket.username.username } =D!`); //joined chatroom of choice
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
        connections.splice(connections.indexOf(socket.id), 1)
        if (userNames != []) {
            console.log('no more users')
        } else {
            userNames.splice(userNames.indexOf(socket.username.username), 1)
        }
        console.log(`users still connected:${connections}, ${userNames}`)
        updateUsers();
        console.log(`Okay,bye =(`)
    });
})