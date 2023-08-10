export default function Avatar({ userId, username }) {
    // Color for avatars are limited to the colors array (6 colors), thus limiting the amount of active users
    // Future goal is to devise a way to create colors that allow for scalability
    const colors = ['bg-red-200', 'bg-green-200', 'bg-purple-200',
        'bg-blue-200', 'bg-yellow-200', 'bg-teal-200'];
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % colors.length;
    const avatarColor = colors[colorIndex];

    return (
        <div className={"flex items-center w-8 h-8 rounded-full " + avatarColor}>
            <div className="text-center w-full opacity-70">{username[0]}</div>
        </div>
    );
}