import React, {Component} from 'react';
import './newChatForm.css'

export interface NewChatState {
    chatName: string,
    imageBase64: string,
}

export interface NewChatProps {
    onCreateClick: Function
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
        console.log(this.state)
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

        console.log(this.state)
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        const {chatName, imageBase64} = this.state;

        // Добавить логику для создания нового чата, например, отправку данных на сервер

        console.log(this.state)
        this.props.onCreateClick(chatName == 'yes')
    }

    render() {
        const {chatName, imageBase64} = this.state;

        return (
            <form className={'new-chat-form'} onSubmit={this.handleSubmit}>
                <label>
                    Название чата:
                    <input type="text" name="chatName" value={chatName} onChange={this.handleInputChange}/>
                </label>
                <br/>
                <label>
                    <span>Изображение чата:</span>
                    <input type="file" name="chatImage" onChange={this.handleImageChange}/>
                    <img src={this.state.imageBase64} alt="Chat Image"/>
                </label>
                <br/>
                <button type="submit">Создать чат</button>
            </form>
        );
    }
}

export default NewChatForm;