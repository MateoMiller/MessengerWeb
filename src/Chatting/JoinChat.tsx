import React, { Component } from 'react';
import './JoinChat.css'; // Подключаем CSS стили

export interface JoinChatProps {
    onChatJoined: Function
}

export interface JoinChatState {
    chatId: string
}

class JoinChatComponent extends Component<JoinChatProps, JoinChatState> {
    constructor(props: JoinChatProps) {
        super(props);
        this.state = {
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

        console.log(`Вход в чат с ID: ${this.state.chatId}`);

    }

    render() {
        return (
            <div className="chat-login">
                <h2>Вход в чат</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        ID чата:
                        <input type="text" value={this.state.chatId} onChange={this.handleChatIdChange} />
                    </label>
                    <br />
                    <button type="submit">Войти в чат</button>
                </form>
            </div>
        );
    }
}

export default JoinChatComponent;
