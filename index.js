var mongoose = require('mongoose');
const client = require('socket.io').listen(5000).sockets;
//mongoose.connect('mongodb://localhost/test');
//const app = require('express')();
//const server = require('http').createServer(app);

//connect to mongoose
mongoose.connect('mongodb://localhost/chatclient', function (err, db) {
    if (err) {
        throw err
    }
    //connected
    console.log("connected to mongoose")
    //connect to socket.io
    client.on('connection', function () {
        let chat = db.collection('chats');
        // function to send status to client
        sendStatus = function (s) {
            socket.emit('status', s);
        }
        //get chats from collection
        chat.find().limit(100).sort({
            _id: 1
        }).toArray(function (err, res) {
            if (err) {
                throw err
            }
            //emit messages
            socket.emit('output', res);
        });
        //input events 
        socket.on('input', function(data){
            let name= data.name;
            let message= data.message;
        })
    })
});