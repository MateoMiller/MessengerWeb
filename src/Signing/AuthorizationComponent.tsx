import React, { Component } from 'react';
import RegisterComponent from './RegisterComponent';
import SignInComponent from './SignInComponent';
import './AuthorizationComponent.css';
import {
    IAuthorizationClient,
    IChattingClient,
    ISessionStateProvider,
    IUserInfoProvider,
    UserInfoProvider
} from "./UserStateProvider";
import UserInfo from "../UserInfo"; // Подключаем CSS стили

type Props = {
    authorizationClient: IAuthorizationClient
    sessionProvider: ISessionStateProvider
    userProvider: IUserInfoProvider
}

type AuthorizationComponentState = {
    showRegister: boolean,
    showSignIn: boolean,
    userInfo?: UserInfo,
}

class AuthorizationComponent extends Component<Props, AuthorizationComponentState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            userInfo: undefined,
            showRegister: false,
            showSignIn: false
        };
    }

    componentDidMount() {
        const sessionState = this.props.sessionProvider.GetSessionState();
        const isLogged = sessionState.sid && sessionState.userId;

        if (isLogged && !this.state.userInfo) {
            this.props.userProvider.Get(sessionState.userId)
                .then(userInfo => { this.setState({ ...this.state, userInfo });
            });
        }
    }

    handleRegister = () => {
        this.setState({ showRegister: true, showSignIn: false });
    }

    handleSignIn = () => {
        this.setState({ showSignIn: true, showRegister: false });
    }

    handleLogout = async () => {
        await this.props.authorizationClient.Logout()
        window.location.reload()
    }

    render() {
        const isLogged = this.state.userInfo !== undefined;

        if (isLogged) {
            const {userInfo} = this.state;
            return (
                <div className="authorization-component">
                    <p>Добро пожаловать, {userInfo!.username}!</p>
                    <img src={userInfo!.imageBase64} alt={userInfo!.username}/>
                    <button onClick={this.handleLogout}>Logout</button>
                </div>
            );
        } else {
            return (
                <div className="authorization-component">
                    <p>Вы не вошли в аккаунт</p>
                    <button onClick={this.handleRegister}>Register</button>
                    <button onClick={this.handleSignIn}>SignIn</button>
                    {this.state.showRegister &&
                        <RegisterComponent onClose={() => this.setState({showRegister: false})} tryRegister={
                            (a, b, c, d) => this.props.authorizationClient.TryRegister(a, b, c, d)}/>}
                    {this.state.showSignIn &&
                        <SignInComponent onClose={() => this.setState({showSignIn: false})} trySignIn={
                            (a, b) => this.props.authorizationClient.TrySignIn(a, b)}/>}
                </div>
            );
        }
    }
}

export default AuthorizationComponent;
