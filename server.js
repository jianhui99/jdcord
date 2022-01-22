const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const PORT = 3000 || process.env.PORT
const botName = 'JDCord Bot'

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Run when client connect
io.on('connect', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        // console.log(user[0].username)
        socket.join(user.room)
        // Welcome current user
        socket.emit('message', formatMessage(botName,'Welcome to chat board')) // For single client

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has join the chat`)) // For all client except the client that connecting

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // Run when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMessage(botName,` ${user.username} has left the chat`)) //For all client

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))