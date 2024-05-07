import React, {Component} from "react";
import {Chats, ChatsList} from "./ChatsList";
import {ChatHistory, ChatInfo} from "./Chat";
import {Message} from "./Message";
import {CommonProps} from "../CommonProps";
import '../styles.css'

export interface ChatComponentsProps extends CommonProps {
    allChats: ChatInfo[]
    //Куда бы это унести подальше?
    currentUserId: string;
    selectedChat: ChatHistory;
}

export interface ChatComponentsState {
    selectedChat: ChatHistory;
}


export class ChatsComponent extends Component<ChatComponentsProps, ChatComponentsState> {
    constructor(props: ChatComponentsProps) {
        super(props);
        this.state = {
            selectedChat: props.selectedChat
        };
    }

    render() {
        return (
            <div className='chats_page'>
                <ChatsList
                    chats={this.props.allChats}
                />
                {this.renderSelectedChat(this.state.selectedChat)}
            </div>
        );
    }

    renderSelectedChat(chat: ChatHistory) {
        if (this.state.selectedChat == null)
            return <div>no chat selected</div>
        return (
            <div>
                <div className={'chat-history'}>
                    {this.state.selectedChat.messages.map(x => this.renderMessage(x))}
                </div>
                {this.renderInputPanel()}
            </div>
        )
    }

    renderMessage(message: Message) {
        return (<div className="message">
            <img
                src={`data:image/png;base64,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`}
                alt="Avatar" className="avatar"/>
            <div>
                {/*TODO Сделать по другому*/}
                <div className="user">{message.senderId}</div>
                {/*TODO Сделать по другому*/}
                <div className={message.senderId == '1' ? 'other_person_text' : 'your_text'}>
                    <p>{message.text}</p>
                    <p className="date">{message.sendDate.toDateString()}</p>
                </div>
            </div>
        </div>)
    }

    renderInputPanel() {
        return (
            <div className={'input-panel'}>
                <textarea className={'text-input'}/>
                <button className={'send-button'}>Send</button>
            </div>
        )
    }
}