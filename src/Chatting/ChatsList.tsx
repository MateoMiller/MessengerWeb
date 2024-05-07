import React, {Component} from "react";
import '../styles.css';
import {ChatInfo} from "./Chat";

export interface Chats {
    chats: ChatInfo[]
}

export class ChatsList extends Component<Chats> {
    render() {
        return (
            <div className='chats-list'>
                {this.props.chats.map(x => this.renderChat(x))}
            </div>
        )
    }

    renderChat(chat: ChatInfo) {
        return (
            <div className="chat">
                <img src={`data:image/png;base64,${chat.user.imageBase64}`} alt="chat image" className="chat-image"/>
                <div className="chat-details">
                    <div className="chat-name">{chat.user.userName}</div>
                    <div className="last-message">{chat.lastSendMessage.text}</div>
                    <div className="last-message-date">{chat.lastSendMessage.sendDate.toDateString()}</div>
                </div>
            </div>
        )
    }
}