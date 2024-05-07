import React, {Component} from "react";

export class SignInComponent extends React.Component
{
    constructor() {
        super(0);
        this.state = {
            login: "",
            password: "",
        };
    }

    render() {
        return (
            <div className='form'>
                    <span className='form--header'>Login</span>
                    <input className='form--input'/>
                    <span className='form--header'>Password</span>
                    <input className='form--input'/>
                <button className='form--button'>Signin</button>
            </div>
        );
    }
}