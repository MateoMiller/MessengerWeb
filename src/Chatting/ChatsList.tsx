import React, {Component} from "react";
import '../styles.css';
import {ChatInfo} from "./Chat";

export interface Props {
    chats: ChatInfo[]
    onChatSelected : (chatId: string) => Promise<any>
}

export class ChatsList extends Component<Props> {
    render() {
        return (
            <div className='chats-list'>
                {this.props.chats.map(x => this.renderChat(x))}
            </div>
        )
    }

    renderChat(chat: ChatInfo) {
        return (
            <div className="chat" onClick={async () => {await this.props.onChatSelected(chat.chatId)}}>
                <img src={chat.base64Image} alt="chat image" className="chat-image"/>
                <div className="chat-details">
                    <div className="chat-name">{chat.name ? chat.name : 'Почему-то названия нет' }</div>
                    <div className="chat-name">{'id:'+ chat.chatId }</div>
                    <div className="last-message">{chat.lastSendMessage?.messageText ?? 'Данный чат пустой'}</div>
                    <div className="last-message-date">{chat.lastSendMessage?.sendDate}</div>
                </div>
            </div>
        )
    }
}