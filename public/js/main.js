const chatForm = document.getElementById('chat-form')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const onlineCount = document.getElementById('online-count')
const chatMessages = document.querySelector('.chat-messages')
const rooms = ['Room A','Room B','Room C',]

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// Check username and room
if(!username || !room){
    window.location.href = "/"
}

if(!rooms.includes(room)){
    window.location.href = "/"
}

const socket = io()

// Join chatroom
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    displayRoomName(room)
    displayUsers(users)
    displayOnlineCount(users)
})

// Message from server
socket.on('message', message => {
    displayMessage(message)
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// Alert from server
socket.on('alert', message => {
    alert(message)
})

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault()
    // Get message text
    const msg = e.target.elements.msg.value

    // Emit message to server
    socket.emit('chatMessage', msg)

    // Emit message to server
    socket.emit('notification')

    // Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// Display message to DOM
function displayMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function displayRoomName(room) {
    roomName.innerText = '# ' + room
}

// Add users to DOM
function displayUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username} <spam id='online'></spam></li>`).join('')}`
}

// Add online user count to DOM
function displayOnlineCount(users) {
    onlineCount.innerHTML = Object.keys(users).length
}
