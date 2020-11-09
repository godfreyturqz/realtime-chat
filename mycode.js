io.on('connection', socket => {

    socket.on('joinRoom', ({username, room})=> {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        // Welcome current user
        socket.emit('message', formatMessage('ChatCord Bot','Welcome to ChatCord!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage('ChatCord Bot',`${user.username} has joined the chat`))

    })

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit(
              'message',
              formatMessage('botName', `${user.username} has left the chat`)
            );
      
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
              room: user.room,
              users: getRoomUsers(user.room)
            });
          }

    })

});