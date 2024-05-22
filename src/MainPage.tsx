import {Component} from "react";
import AuthorizationComponent from "./Signing/AuthorizationComponent";
import {ChatsList} from "./Chatting/ChatsList";
import {ChatsComponent} from "./Chatting/ChatsComponent";


class MainPage extends Component{
    /*render() {
        return (<div style={{width: "max-content", height: "fit-content"}}>
                {/!*<AuthorizationComponent></AuthorizationComponent>*!/}
                <ChatsComponent currentUserId={'12'} allChats={[{
                    user: {
                        userName: "123",
                        imageBase64: '',
                        id: '1234'
                    },
                    lastSendMessage:{
                        sendDate: new Date(),
                        senderId: "213",
                        text: "123"
                    }
                }]} selectedChat={
                    {messages: []}
                }></ChatsComponent>
            </div>
        );
    }*/
}

export default MainPage;