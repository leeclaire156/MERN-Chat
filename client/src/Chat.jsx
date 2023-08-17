import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { uniqBy } from 'lodash';

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const { username, id } = useContext(UserContext);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage)
    }, []);

    // reduces the data of who is online to unique values only
    // for each object (user) that is online, there is a new object whose key: value pair is the userId (key) and the username (value)
    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username
        })
        setOnlinePeople(people);
    }

    function handleMessage(event) {
        // returns object of who is online, will show duplicates as each refresh on the page is a new connection and will be added to the messageData
        const messageData = JSON.parse(event.data);

        console.log({ event, messageData });

        // If theres something in the online key of the messageData array, that means there's users that are online
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            // isOur: false means it not our message but the other party's (incoming message)
            setMessages(prevMessage => ([...prevMessage, { ...messageData }]));
        }
    }

    function sendMessage(event) {
        event.preventDefault();
        ws.send(JSON.stringify({
            message: {
                recipient: selectedUserId,
                text: newMessageText,
            }
        }));
        // Resets state to empty string after message is sent, thus clearing the message input from the form
        setNewMessageText('');
        // isOur: true means it our message (outgoing message)
        setMessages(prevMessage => ([...prevMessage, {
            text: newMessageText,
            sender: id,
            recipient: selectedUserId,
        }]));
    }

    const onlinePeopleThatsNotUs = { ...onlinePeople };
    delete onlinePeopleThatsNotUs[id];

    // Prevents duplicate messages
    const uniqueMessages = uniqBy(messages, 'id');

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3">
                <Logo />
                {Object.keys(onlinePeopleThatsNotUs).map(userId => (
                    <div onClick={() => { setSelectedUserId(userId); console.log(selectedUserId) }} key={userId}
                        className={"flex items-center gap-2 border-b border-gray-100 cursor-pointer " + (userId === selectedUserId ? 'bg-blue-50' : '')}>
                        {userId === selectedUserId && (
                            <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
                        )}
                        <div className="flex gap-2 py-2 pl-4 items-center">
                            <Avatar username={onlinePeople[userId]} userId={userId} />
                            <span className="text-grey-800">{onlinePeople[userId]}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-gray-300">&larr; Select a conversation</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div>
                            {uniqueMessages.map(message => (
                                <div key={parseInt(message.text)}>
                                    sender:{message.sender}<br></br>
                                    my id: {id}<br></br>
                                    {message.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* !! returns boolean value, empty returns as false & not empty returns as true */}
                {/* If there's no selected user/conversation, the message input form to send messages will not appear */}
                {!!selectedUserId && (
                    <form className="flex gap-2" onSubmit={sendMessage}>
                        <input type="text"
                            value={newMessageText}
                            onChange={event => setNewMessageText(event.target.value)}
                            placeholder="Type your message here"
                            className="bg-white flex-grow border rounded-sm p-2" />
                        <button type="submit" className="bg-blue-500 text-white rounded-sm p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}