import axios from "axios";
import UserInfo from "../UserInfo";
import {ChatInfo} from "../Chatting/Chat";
import {Message} from "../Chatting/Message";

export interface SessionState
{
    sid: string;
    userId: string;
}

export interface ISessionStateProvider
{
    GetSessionState(): SessionState;
}

export class SessionStateProvider implements ISessionStateProvider
{
    GetSessionState(){
        const cookies = document.cookie.split('; ');
        const sidCookie = cookies.find(row => row.startsWith('auth.sid='));
        const userIdCookie = cookies.find(row => row.startsWith('userId='));

        const sid = sidCookie ? sidCookie.split('=')[1] : '';
        const userId = userIdCookie ? userIdCookie.split('=')[1] : '';

        return { sid, userId };
    }
}

export interface IAuthorizationClient{
    TrySignIn(login: string, password: string) : Promise<boolean>;
    TryRegister(login: string, password: string, username: string, imageBase64: string): Promise<boolean>;
    Logout(): Promise<any>;
}


export class AuthorizationClient implements IAuthorizationClient
{
    private readonly _apiUrl: string;
    constructor(apiUrl: string) {
        this._apiUrl = apiUrl;
    }

    Logout(): Promise<any> {
        return axios.post(this._apiUrl +'/auth/logout');
    }

    async TryRegister(login: string, password: string, username: string, imageBase64: string): Promise<boolean> {
        const response = await axios
            .post(this._apiUrl + '/auth/register', {
                login: login,
                password: password,
                username: username,
                imageBase64: imageBase64
            });
        return response.status < 300;
    }

    async TrySignIn(login: string, password: string): Promise<boolean> {
        const response = await axios
            .post(this._apiUrl + '/auth/signIn', {
                login: login,
                password: password
            });
        return response.status < 300;
    }
}

export interface IUserInfoProvider
{
    Get(userId: string) : Promise<UserInfo>;
    GetMany(usersIds: string[]) : Promise<UserInfo[]>;
}

export class UserInfoProvider implements IUserInfoProvider{
    private readonly _chattingClient: IChattingClient;
    private readonly _cachedUsers: {[key: string]: UserInfo} = {};

    constructor(chattingClient: IChattingClient) {
        this._chattingClient = chattingClient;
    }

    async Get(userId: string): Promise<UserInfo> {
        if (this._cachedUsers[userId]) {
            return this._cachedUsers[userId];
        } else {
            const user = await this._chattingClient.GetUsers([userId]);
            this._cachedUsers[userId] = user[0];
            return user[0];
        }
    }

    async GetMany(usersIds: string[]): Promise<UserInfo[]> {
        const usersNotInCache = usersIds.filter(id => !this._cachedUsers[id]);
        const newUsers = await this._chattingClient.GetUsers(usersNotInCache);

        newUsers.forEach(user => {
            this._cachedUsers[user.userId] = user;
        });

        const cachedUsers = usersIds
            .filter(id => this._cachedUsers[id])
            .map(id => this._cachedUsers[id]);

        return [...newUsers, ...cachedUsers];
    }
}

export interface IChattingClient{
    GetUsers(usersIds: string[]) : Promise<UserInfo[]>
    GetAllChats(): Promise<ChatInfo[]>;
    CreateChat(chatName: string, base64Image: string): Promise<ChatInfo>;
    JoinChat(chatId: string): Promise<ChatInfo>;
    SendMessage(chatId: string, text: string): Promise<any>;
    GetMessages(chatId: string): Promise<Message[]>;
}

export class ChattingClient implements IChattingClient{
    private readonly _apiUrl: string;
    constructor(apiUrl: string) {
        this._apiUrl = apiUrl;
    }
    async CreateChat(chatName: string, base64Image: string): Promise<ChatInfo> {
        const res =  await axios.post(this._apiUrl + "/chats/create", {
            chatName: chatName,
            imageBase64: base64Image
        });
        return res.data;
    }

    async GetAllChats(): Promise<ChatInfo[]> {
        const res =  await axios.get(this._apiUrl + "/chats/");
        return res.data;
    }

    async GetMessages(chatId: string): Promise<Message[]> {
        const res = await axios.post(this._apiUrl + "/chats/get-messages",{
                chatId: chatId
        });
        return res.data;
    }

    async GetUsers(usersIds: string[]): Promise<UserInfo[]> {
        let x = await axios.post(this._apiUrl + "/chats/get-users", {
            usersIds: usersIds
        });
        return await x.data;
    }

    async JoinChat(chatId: string): Promise<ChatInfo> {
        const res =  await axios.post(this._apiUrl + "/chats/join",{
            chatId: chatId
        });
        return res.data;
    }

    async SendMessage(chatId: string, text: string): Promise<any> {
        const res =  await axios.post(this._apiUrl + "/chats/send-message",{
            chatId: chatId,
            text: text
        });
        return res.data;
    }

}