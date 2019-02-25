const express = require('express');
const app = express();
const bodyParser = require("body-parser");
let userNames= [];
//set template engine ejs
app.set('view engine', 'ejs')
//middlewares ???
app.use(bodyParser.json());
app.use(express.static('public'));
//routes
app.get('/', (req, res) => {
    res.render('index')
})
//listen on port 3000
server = app.listen(3000);
//socket io time
const io = require('socket.io')(server);
//listen on every connection :o
io.on('connection', (socket) => {
    console.log('new user yay!')
    //default username
    socket.username="Anon"
    //listen on change_username
    socket.on('change_username',(data)=>{
        socket.username=data.username;
        userNames[socket.username]=socket;
        io.sockets.emit('usernames',Object.keys(userNames));
    })
    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})