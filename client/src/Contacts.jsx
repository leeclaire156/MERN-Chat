import Avatar from "./Avatar";

export default function Contact({id, username, onClick, selected, online}) {
    return (
        <div onClick={() => { onClick(id); console.log(id)}} key={id}
            className={"flex items-center gap-2 border-b border-gray-100 cursor-pointer " + (selected ? 'bg-blue-50' : '')}>
            {selected && (
                <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar online={online} username={username} userId={id} />
                <span className="text-grey-800">{username}</span>
            </div>
        </div>
    )
}