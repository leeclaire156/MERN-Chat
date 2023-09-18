const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs')

const jwtSecret = `${process.env.JWT_SECRET}`;
// 10 rounds of salting
const bcryptSalt = bcrypt.genSaltSync(10);

dotenv.config();
mongoose.connect(process.env.MONGODB_URL);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));


// Function to obtain userData from token
async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData);
            });
        } else {
            reject('no token');
        }
    })

}

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.get('/messages/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;
    const messages = await Message.find({
        sender: { $in: [userId, ourUserId] },
        recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 }); //Sorts in ascending order (first message on top, latest message on bottom)
    res.json(messages);
});

app.get('/people', async (req, res) => {
    //first curly brackets {} is conditions, which we have none
    //second curly brackets {'_id': 1, username: 1} is what we want to select, where _id and username is true (denoted by 1)
    const users = await User.find({}, { '_id': 1, username: 1 });
    res.json(users);
});

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });
    } else {
        res.status(401).json('No token found');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username })
    if (foundUser) {
        const match = bcrypt.compareSync(password, foundUser.password);
        if (match) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                    id: foundUser._id,
                });
            })
        }
    }
});

app.post('/logout', (req, res) => {
    // resetting the cookie by passing an empty 2nd parameter
    res.cookie('token', '', { sameSite: 'none', secure: true }).status(201).json('logged out');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt)
        const newUser = await User.create({
            username: username,
            password: hashedPassword,
        });
        jwt.sign({ userId: newUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: newUser._id,
            });
        });
    } catch (err) {
        if (err) throw err;
        res.status(500).json('error')
    }
});

//Above is API server that responds with JSON, below is websocket server
const ws = require('ws'); // websocket library
const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server }); //websocket server

wss.on('connection', (connection, req) => {
    function notifyAboutOnlinePeople() {
        // Notifies everyone about online users (when someone connects)
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(client => ({ userId: client.userId, username: client.username }))
            }))
        })
    }

    //after connecting, we are going to add a ping
    connection.isAlive = true;

    // setInterval runs the function inside every 5 seconds, in this case, we are sending pings to our connection every 5s
    connection.timer = setInterval(() => {
        connection.ping();
        // setTimeout will run the function inside 1 second after pinging and will occur if we do not get a pong
        // this function inside will set isAlive to false, and terminate the connection, then notify with new list of online people after someone goes offline
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            // Stops trying to ping even after logging out of session
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlinePeople();
            console.log('dead');
        }, 1000)
    }, 5000)

    //pong to our ping
    //will cancel the deathTimer(?)
    connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
    })


    // Reads username and id from the cookie for this connection
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err) throw err;
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;
                });
            }
        }
    }

    connection.on("message", async (message) => {
        // message is an object (coming from Chat.jsx with keys: recipient and text) so we must convert to string
        const messageData = JSON.parse(message.toString());
        const { recipient, text, file } = messageData;
        if (file) {
            var parts = file.name.split('.');

            //obtains file type (png, pdf, jpeg, etc)
            const extension = parts[parts.length - 1];
            //filename will not be what it is originally named on the local pc but is, instead, given a new name
            const filename = Date.now() + '.' + extension;
            //sends files to /upload folder in /api folder (current directory, aka __dirname)
            const pathname = __dirname + '/uploads/' + filename;

            // need to read contents of data from file.data in sendFile function of Chat.jsx
            // bc data is based64 encoded, we need to decode it
            // The buffers module provides a way of handling streams of binary data.
            const bufferData = new Buffer.from(file.data, 'base64');
            fs.writeFile(pathname, bufferData, () => {
                console.log('file saved:' + pathname)
            });
        }
        if (recipient && text) {

            // Stores message in MongoDB
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
            });

            // [...wss.clients].filter(client => client.userId === recipient) checks if the recipient is online
            [...wss.clients]
                .filter(client => client.userId === recipient)
                .forEach(client => client.send(JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    _id: messageDoc._id,
                })));
        }
    });

    notifyAboutOnlinePeople();
})

wss.on('close', data => {
    console.log('disconnected', data);
})