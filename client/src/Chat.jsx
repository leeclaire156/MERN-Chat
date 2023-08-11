import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import Avatar from "./Avatar";
import Logo from "./Logo";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { username, id } = useContext(UserContext);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage)
    }, []);

    function handleMessage(event) {
        // returns object of who is online, will show duplicates as each refresh on the page is a new connection and will be added to the messageData
        const messageData = JSON.parse(event.data)

        // reduces the data of who is online to unique values only
        // for each object (user) that is online, there is a new object whose key: value pair is the userId (key) and the username (value)
        function showOnlinePeople(peopleArray) {
            const people = {};
            peopleArray.forEach(({ userId, username }) => {
                people[userId] = username
            })
            setOnlinePeople(people);
        }

        // If theres something in the online key of the messageData array, that means there's users that are online
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        }
    }

    const onlinePeopleThatsNotUs = { ...onlinePeople };
    delete onlinePeopleThatsNotUs[id];

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3">
                <Logo />
                {Object.keys(onlinePeopleThatsNotUs).map(userId => (
                    <div onClick={() => setSelectedUserId(userId)} key={onlinePeople[userId]}
                        className={"flex items-center gap-2 border-b border-gray-100 py-2 pl-4 cursor-pointer " + (userId === selectedUserId ? 'bg-blue-50' : '')}>
                        <Avatar username={onlinePeople[userId]} userId={userId} />
                        <span className="text-grey-800">{onlinePeople[userId]}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    Messages with selected person
                </div>
                <div className="flex gap-2">
                    <input type="text"
                        placeholder="Type your message here"
                        className="bg-white flex-grow border rounded-sm p-2" />
                    <button className="bg-blue-500 text-white rounded-sm p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}