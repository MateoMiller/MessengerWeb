import React from 'react';

type RegisterComponentProps = {
    onClose: () => void
    tryRegister: (login: string, password: string, username: string, imageBase64: string) => Promise<boolean>
}

type RegisterComponentState = {
    showErrorText: boolean
    login: string
    password: string
    username: string
    imageBase64: string
}

class RegisterComponent extends React.Component<RegisterComponentProps, RegisterComponentState>{
    constructor(props: any) {
        super(props);
        this.state = {
            login: '',
            password: '',
            username: '',
            showErrorText: false,
            imageBase64: ''
        }
        this.handleSubmitRegistration = this.handleSubmitRegistration.bind(this)
    }

    handleSubmitRegistration = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(this.state);

        const {login, password, username, imageBase64} = this.state;
        await this.props.tryRegister(login, password, username, imageBase64)
            .then(isSuccess => this.setState({
                ...this.state,
                showErrorText: isSuccess
            }))
            .then(isSuccess => this.props.onClose())
            .catch(err => this.setState({...this.state, showErrorText: true}))
    }

    hideError = (event: React.FormEvent) => {
        console.log(event);
        this.setState({
            ...this.state,
            showErrorText: false,
        })
    }

    render() {
        return (
            <div className="registration-overlay">
                <form onSubmit={this.handleSubmitRegistration}>
                    <h2>Register</h2>
                    <label>
                        Логин:
                        <input onClick={this.hideError} type="text" value={this.state.login}
                               onChange={e => this.setState({ ...this.state, login: e.target.value })}/>
                    </label>
                    <label>
                        Пароль:
                        <input onClick={this.hideError} type="password" value={this.state.password}
                               onChange={e => this.setState({ ...this.state, password: e.target.value })}/>
                    </label>
                    <label>
                        Имя аккаунта:
                        <input onClick={this.hideError} type="text" value={this.state.username}
                               onChange={e => this.setState({ ...this.state, username: e.target.value })}/>
                    </label>
                    <label>
                        Картинка:
                        <input type="file" onChange={this.handleImageChange} />
                        {this.state.imageBase64 && <img style={{maxHeight: "250px"}} src={this.state.imageBase64} alt={'Your avatar'}></img>}
                    </label>
                    {this.state.showErrorText && <span className={'errorText'}>Что-то пошло не так. Скорее всего такой логин уже существует. Или ты поле какое-то не заполнил, из-за чего бэк ругается. Смотри логи, чтобы понять ошибку</span>}
                    <button type="submit">Submit</button>
                    <button onClick={this.props.onClose}>Close</button>
                </form>
            </div>
        );
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
}

export default RegisterComponent;
