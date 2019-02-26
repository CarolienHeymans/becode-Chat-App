//server side

const express = require('express');
const app = express();

let userNames = [];
// let rooms = ["Games", "Books", "Coding"]
const server = require('http').Server(app);
const io = require('socket.io')(server);

//set template engine ejs
app.set('view engine', 'ejs')
//middlewares ???
app.use(express.static('public'));
//routes
app.get('/', (req, res) => {
    res.render('index')
})
//listen on port 3000
server.listen(3000);
console.log("it's alive!");


// connection :o
io.on('connection', (socket) => {
    console.log('Hello =)')
    socket.on('disconnect', function () {
        console.log('Goodbye =(')
    })
    //default username
    socket.username = "Anon"
    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username;
        userNames[socket.username] = socket;
        io.sockets.emit('usernames', Object.keys(userNames));
    })

    //join room + sending messages
    socket.on('joinRoom', (room) => {
        socket.join(room)
        console.log("succes", "Succesfully joined " + room);
        socket.on('new_message', (data) => {
            io.to(room).emit('new_message', {
                message: data.message,
                username: socket.username
            })
        })
        // typing....
        socket.on('typing', (data) => {
            io.to(room).emit('typing', {
                username: socket.username
            })
        })

    })
})