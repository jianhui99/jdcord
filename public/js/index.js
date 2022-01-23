const roomSelector = document.getElementById('room')
const rooms = ['Room A','Room B','Room C',]

displayRooms()

// Display rooms
function displayRooms() {
    roomSelector.innerHTML = `
        ${rooms.map(room => `<option value="${room}">${room}</option>`)}
    `
}
