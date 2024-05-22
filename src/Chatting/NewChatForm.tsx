import React, {Component} from 'react';
import './newChatForm.css'
import '../Signing/AuthorizationComponent.css'
import {ChatInfo} from "./Chat";

export interface NewChatState {
    chatName: string,
    imageBase64: string,
}

export interface NewChatProps {
    close: () => void
    tryCreateChat: (name: string, imageBase64: string) => Promise<ChatInfo>
}


class NewChatForm extends Component<NewChatProps, NewChatState> {
    constructor(props: NewChatProps) {
        super(props);
        this.state = {
            chatName: '',
            imageBase64: ''
        };
    }

    handleInputChange = (event: any) => {
        const {name, value} = event.target;
        this.setState(
            {
                ...this.state,
                chatName: value
            });
    }

    handleImageChange = (event: any) => {
        const image = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result;
            this.setState({
                ...this.state,
                imageBase64: base64Image!.toString()
            });
        };

        reader.readAsDataURL(image);
    }

    handleSubmit = async (event: any) => {
        event.preventDefault();
        const {chatName, imageBase64} = this.state;

        const isSuccess = await this.props.tryCreateChat(
            chatName, imageBase64
        );
        if (isSuccess)
            this.props.close()
        else
            this.setState({
                ...this.state,
                //Мб ошибку показывать
            })
    }

    render() {
        return (
            <>
                <div className="overlay"></div>
                    <form className={'new-chat-form'} onSubmit={this.handleSubmit}>
                        <label>
                            Название чата:
                            <input type="text" name="chatName" value={this.state.chatName} onChange={this.handleInputChange}/>
                        </label>
                        <br/>
                        <label>
                            <span>Изображение чата:</span>
                            <input type="file" name="chatImage" onChange={this.handleImageChange}/>
                            <img src={this.state.imageBase64} alt="Chat Image"/>
                        </label>
                        <br/>
                        <button type="submit">Создать чат</button>
                        <button onClick={() => this.props.close()}>Close</button>
                </form>
            </>
        );
    }
}

export default NewChatForm;