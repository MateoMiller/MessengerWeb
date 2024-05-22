import React, {Component} from 'react';
import logoutIcon from './logout.svg';
import './styles.css';
import {UserInfo} from "./UserInfo";

export interface LoggedUserComponentProps{
    user: UserInfo;
}
export class LoggedUserComponent extends Component<LoggedUserComponentProps> {
    render() {
        return(
            <div className='App'>
                <img className='icon' src={this.props.user.imageBase64} alt={"Your avatar"}/>
                <p className='iconCaption'>{this.props.user.username}</p>
                <button>
                    <img width='20px' height='20px' className='icon' src={logoutIcon} alt='Logout'></img>
                </button>
            </div>
        )
    }
}

export default LoggedUserComponent;
