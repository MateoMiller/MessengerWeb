import React, {Component} from 'react';
import logoutIcon from './logout.svg';
import './styles.css';
import {UserInfo} from "./UserInfo";
export class LoggedUserComponent extends Component<UserInfo> {
    render() {
        return(
            <div className='App'>
                <img className='icon' src={`data:image/png;base64,${this.props.imageBase64}`} alt={"Your avatar"}/>
                <p className='iconCaption'>{this.props.userName}</p>
                <button>
                    <img width='20px' height='20px' className='icon' src={logoutIcon} alt='Logout'></img>
                </button>
            </div>
        )
    }
}

export default LoggedUserComponent;
