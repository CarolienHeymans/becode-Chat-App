//client side

$(function () {
    //make connection
    const socket = io.connect('http://localhost:3000')

    //buttons & inputs
    
    let message = $("#message");
    let username = $("#username");
    let send_message = $("#send_message");
    let submit = $("#submit");
    let chatroom = $("#chatroom");
    let feedback = $("#feedback")
    let users = $("#userList")
  

    //username + room
    submit.click(function () {
        let selectedRoom = $("#chatRoomOptions").val();
        socket.emit('change_username', {
            username: username.val()
        })
        
        $("#chatroomName").html(selectedRoom);
        socket.emit("joinRoom", selectedRoom);
        socket.on("err", (err) => console.log(err))
        socket.on("succes", (res) => console.log(res))
    })
    // //add user to list
    socket.on('usernames', (data) => {
        let listOfUsers = '';
        for (i = 0; i < data.length; i++) {
            listOfUsers += `<li>` + data[i] + `</li>`
        }
        users.html(listOfUsers)
        $("#namesWrapper").hide()
        $("#mainWrapper").show()

    })

    //emit/send message
    send_message.click(function () {
      socket.emit('new_message', {
            message: message.val()
        })
    })

    //Listen on new_message
    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    })
    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing')
    })

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
    })



})