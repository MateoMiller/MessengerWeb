import React, {Component} from "react";
import {ChatsList} from "./ChatsList";
import {ChatHistory, ChatInfo} from "./Chat";
import {Message} from "./Message";
import {CommonProps} from "../CommonProps";
import '../styles.css'
import NewChatForm from "./NewChatForm";
import JoinChatComponent from "./JoinChat";
import {IChattingClient, ISessionStateProvider, IUserInfoProvider} from "../Signing/UserStateProvider";
export interface ChatComponentsProps extends CommonProps {
    chattingClient: IChattingClient,
    sessionStateProvider: ISessionStateProvider,
    userInfoProvider: IUserInfoProvider
}

export interface ChatComponentsState {
    selectedChat?: ChatHistory;
    showCreateChatWindow: boolean,
    showJoinToChatWindow: boolean,
    allChats?: ChatInfo[]
    inputText: string;
}


export class ChatsComponent extends Component<ChatComponentsProps, ChatComponentsState> {
    private interval: NodeJS.Timer | undefined;
    constructor(props: ChatComponentsProps) {
        super(props);
        this.state = {
            inputText: "",
            allChats: undefined,
            selectedChat: undefined,
            showCreateChatWindow: false,
            showJoinToChatWindow: false
        };
        this.onCreateChatButtonClick = this.onCreateChatButtonClick.bind(this);
        this.onChatCreated = this.onChatCreated.bind(this);
        this.onJoinChatButtonClick = this.onJoinChatButtonClick.bind(this);
    }

    componentDidMount() {
        const sessionState = this.props.sessionStateProvider.GetSessionState();
        const isLogged = sessionState.sid && sessionState.userId;

        console.log('Я маунчу')
        this.interval = setInterval(() => this.updateChats(), 5000)
        if (isLogged && !this.state.allChats){

            this.props.chattingClient.GetAllChats()
                .then(res => this.setState({
                    ...this.state,
                    allChats: res
                }))
        }
    }

    async updateChats(){
        console.log('Я апдейчу')
        const updatedChats = await this.props.chattingClient.GetAllChats();
        const {allChats, selectedChat} = this.state;

        const stringifyAndSort = (arr: ChatInfo[]) => arr.map(info => JSON.stringify(info)).sort();

        const sortedArr1 = stringifyAndSort(allChats!);
        const sortedArr2 = stringifyAndSort(updatedChats);

        if (JSON.stringify(sortedArr1) != JSON.stringify(sortedArr2)){
            console.log('Я проверяю кек')
            if (selectedChat){
                console.log('Я проверяю сообщение')
                const updatedSelectedChat = updatedChats.find(x => x.chatId == selectedChat.chatId)!;
                const lastKnownSelectedChat = selectedChat.messages.reduce((maxChat: Message | null, currentChat: Message) => {
                    if (!maxChat || currentChat.sendDate > maxChat.sendDate) {
                        return currentChat;
                    }
                    return maxChat;
                }, null);

                if (JSON.stringify(lastKnownSelectedChat) != JSON.stringify(updatedSelectedChat.lastSendMessage)){
                    const messages = await this.props.chattingClient.GetMessages(selectedChat.chatId);
                    const usersIds = messages.map(x => x.senderId);
                    const users = await this.props.userInfoProvider.GetMany(usersIds);
                    console.log('Я обновил и чаты и сообщения')
                    this.setState({
                        ...this.state,
                        allChats: updatedChats,
                        selectedChat: {
                            messages: messages,
                            chatId: selectedChat.chatId,
                            users: users
                        }}
                    );
                    return;
                }
            }
                console.log('Я обновил по простому');
                this.setState({
                    ...this.state,
                    allChats: updatedChats
                })
        }
        else{
            console.log('Кажись ничего не поменялось')
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className='chats_page'>
                {this.state.showCreateChatWindow && <NewChatForm close={this.onChatCreated} tryCreateChat={(a, b) => this.props.chattingClient.CreateChat(a, b)}></NewChatForm>}
                {this.state.showJoinToChatWindow && <JoinChatComponent close={this.onChatJoined} tryJoinChat={(c) => this.props.chattingClient.JoinChat(c)}></JoinChatComponent>}
                <div>
                    <div style={{maxHeight: "50px", border: "#0051ff solid 5px"}}>
                        <button onClick={this.onCreateChatButtonClick}>Создать чат</button>
                        <button onClick={this.onJoinChatButtonClick}>Вступить в чат</button>
                    </div>
                    <ChatsList chats={this.state.allChats ?? []} onChatSelected={(x) => this.updateSelectedChat(x)}/>
                </div>
                {this.renderSelectedChat(this.state.selectedChat ?? {users: [], chatId: '', messages:[]})}
            </div>
        );
    }

    async updateSelectedChat(chatId: string) {
        const messages = await this.props.chattingClient.GetMessages(chatId);
        const usersIds = messages.map(x => x.senderId);
        const users = await this.props.userInfoProvider.GetMany(usersIds);
        return this.setState({
                ...this.state,
                selectedChat: {
                    messages: messages,
                    chatId: chatId,
                    users: users
                }
            }
        );
    }

    onCreateChatButtonClick(event: React.MouseEvent<HTMLButtonElement>){
        this.setState(
            {
            ...this.state,
            showCreateChatWindow: !this.state.showCreateChatWindow
        });
    }

    onChatCreated()
    {
        this.setState(
            {
                ...this.state,
                showCreateChatWindow: false
            });
    }

    onJoinChatButtonClick(event: React.MouseEvent<HTMLButtonElement>){
        console.log(this.state)
        this.setState(
            {
                ...this.state,
                showJoinToChatWindow: !this.state.showJoinToChatWindow
            });
    }

    onChatJoined(event: React.MouseEvent<HTMLButtonElement>){
        this.setState(
            {
                ...this.state,
                showJoinToChatWindow: false
            });
    }


    renderSelectedChat(chat: ChatHistory) {
        if (this.state.selectedChat == null)
            return <div>no chat selected</div>
        return (
            <div>
                <div className={'chat-history'}>
                    {this.state.selectedChat.messages.map(x => this.renderMessage(x))}
                </div>
                {this.renderInputPanel()}
            </div>
        )
    }

    renderMessage(message: Message) {
        const sessionState = this.props.sessionStateProvider.GetSessionState();
        const sender = this.state.selectedChat?.users.find(x => x.userId == message.senderId);
        return (<div className="message">
            <img
                //TODO Картинку сендера
                src={sender?.imageBase64}
                alt="Avatar" className="avatar"/>
            <div>
                <div className="user">{sender?.username ?? 'А кто вообще послал сообщение?'}</div>
                <div className={message.senderId == sessionState.userId ? 'other_person_text' : 'your_text'}>
                    <p>{message.messageText}</p>
                    <p className="date">{message.sendDate}</p>
                </div>
            </div>
        </div>)
    }

    renderInputPanel() {
        return (
            <div className={'input-panel'}>
                <textarea className={'text-input'} onChange={e => this.setState({...this.state, inputText: e.target.value})}>{this.state.inputText}</textarea>
                <button className={'send-button'} onClick={() => this.sendMessage()}>Send</button>
            </div>
        )
    }

    async sendMessage(){
        const {inputText, selectedChat} = this.state;
        await this.props.chattingClient.SendMessage(
            selectedChat!.chatId,
            inputText
        );

    }
}