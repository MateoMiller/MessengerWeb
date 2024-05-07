import {UserInfo} from "../UserInfo";
import {Message} from "./Message";

export interface ChatInfo
{
    user: UserInfo;
    lastSendMessage: Message;
}

export interface ChatHistory
{
    messages: Message[];
}