export default function Avatar({ userId, username, online }) {
    // Color for avatars are limited to the colors array (6 colors), thus limiting the amount of active users
    // Future goal is to devise a way to create colors that allow for scalability
    const colors = ['bg-red-200', 'bg-green-200', 'bg-purple-200',
        'bg-blue-200', 'bg-yellow-200', 'bg-teal-200'];
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % colors.length;
    const avatarColor = colors[colorIndex];

    return (
        <div className={"flex items-center relative w-8 h-8 rounded-full " + avatarColor}>
            <div className="text-center w-full opacity-70">{username[0]}</div>
            {/* if user is online (online = true passed from Chat.jsx), then will display green icon */}
            {online && (
                <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
            )}
        </div>
    );
}