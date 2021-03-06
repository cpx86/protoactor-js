"use strict"

var messages = require('./messages')

class LocalProcess {
    constructor(mailbox) {
        this.Mailbox = mailbox
    }

    SendUserMessage(pid, message, sender) {
        if (sender) {
            return this.Mailbox.PostUserMessage(new messages.MessageSender(message, sender))
        }
        return this.Mailbox.PostUserMessage(message)
    }

    SendSystemMessage(pid, message) {
        return this.Mailbox.PostSystemMessage(message)
    }

    Stop(pid) {
        this.SendSystemMessage(pid, messages.Stop)
    }
}

module.exports = LocalProcess