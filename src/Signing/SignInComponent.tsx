import React from 'react';
import {Simulate} from "react-dom/test-utils";

type SignInComponentProps = {
    onClose: () => void
    trySignIn: (login: string, password: string) => Promise<boolean>
}

type SignInComponentState = {
    showError: boolean
    login: string
    password: string
}

class SignInComponent extends React.Component<SignInComponentProps, SignInComponentState>{
    constructor(props: SignInComponentProps) {
        super(props);
        this.state = {
            login: '',
            password: '',
            showError: false
        };
        this.hideError = this.hideError.bind(this)
        this.handleSubmitSignIn = this.handleSubmitSignIn.bind(this)
    }

    handleSubmitSignIn = async (event: any) => {
        event.preventDefault();
        console.log(this.state);
        const { login, password} = this.state;
        const isSuccess = await this.props.trySignIn(login, password);

        if (isSuccess) {
            this.props.onClose();
            window.location.reload();
        }
        else
            this.setState({
            ...this.state,
            showError: true
        });
    }

    render() {
        return (
            <div className="sign-in-overlay">
                <form onSubmit={this.handleSubmitSignIn}>
                    <h2>Sign In</h2>
                    <label>
                        Логин:
                        <input onClick={this.hideError} type="text" value={this.state.login} onChange={e => this.setState({ ...this.state, login: e.target.value })}/>
                    </label>
                    <label>
                        Пароль:
                        <input onClick={this.hideError} type="password" value={this.state.password} onChange={e => this.setState({ ...this.state, password: e.target.value })}/>
                    </label>
                    {this.state.showError && <p className={'errorText'}>Неверно указан логин или пароль</p>}
                    <button>Submit</button>
                    <button onClick={this.props.onClose}>Close</button>
                </form>
            </div>
        );
    }

    hideError(event: any){
        this.setState({
            showError: false
        });
    }
}

export default SignInComponent;
