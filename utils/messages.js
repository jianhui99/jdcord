const momment = require('moment')

function formatMessage(username, text) {
    return {
        username, text, time: momment().format('h:mm a')
    }
}

module.exports = formatMessage