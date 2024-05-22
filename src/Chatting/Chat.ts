import {UserInfo} from "../UserInfo";
import {Message} from "./Message";

export interface ChatInfo
{
    name: string;
    base64Image: string;
    chatId: string;
    lastSendMessage?: Message;
}

export type ChatHistory = {
    messages: Message[];
    chatId: string;
    users: UserInfo[]
}