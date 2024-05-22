import React, { Component } from 'react';
import './JoinChat.css';
import './newChatForm.css'
import '../Signing/AuthorizationComponent.css'
import {ChatInfo} from "./Chat"; // Подключаем CSS стили

export interface JoinChatProps {
    close: Function
    tryJoinChat: (chatId: string) => Promise<ChatInfo>
}

export interface JoinChatState {
    chatId: string
    showError: boolean
}

class JoinChatComponent extends Component<JoinChatProps, JoinChatState> {
    constructor(props: JoinChatProps) {
        super(props);
        this.state = {
            showError: false,
            chatId: ''
        };
    }

    handleChatIdChange = (event: any) => {
        this.setState({
            chatId: event.target.value
        });
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        const {chatId} = this.state;
        return this.props.tryJoinChat(chatId)
            .catch(err => {
                this.setState({
                    ...this.state,
                    showError: true
                });
            })

    }

    render() {
        return (
            <div className="overlay">
                <form className={'new-chat-form'} onSubmit={this.handleSubmit}>
                    <h2>Вход в чат</h2>
                    <label>
                        ID чата:
                        <input type="text" value={this.state.chatId} onChange={this.handleChatIdChange} />
                    </label>
                    <br />
                    <button type="submit">Войти в чат</button>
                    <button onClick={() => this.props.close()}>Close</button>
                </form>
            </div>
        );
    }
}

export default JoinChatComponent;
