# live_poll

A real-time polling app built using WebSockets for live bidirectional communication between clients and the server.

## 🚀 Features

- Live voting updates
- Real-time data broadcasting with Socket.IO
- Clean and simple interface
- Instant feedback on poll choices

## 🛠 Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **WebSockets**: Socket.IO

## 📦 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/live_poll.git
setup .env file 
npm install && npm start
cd client && npm install && npm run dev
```
live_poll/
├── client/       # Frontend (React)
├── server/       # Backend (Node.js + Express + Socket.IO)
└── README.md



---

### 🏠 Home Page Overview

On the **Home Page**, users have two options:  
**➕ Create Room** or **🔑 Join Room**

#### ✅ Create Room
- Simply enter a **unique name** to generate a new poll.
- You will be redirected to the poll page where you can vote for either **Dog** or **Cat**.
- A **unique room code** will be displayed on the poll page for others to join.

#### 🔁 Join Room
- Open the app in another browser or device.
- Choose **Join Room** from the home page.
- Enter the **same unique name** and the **room code** shared by the poll creator.
- You'll be taken to the live poll where you can cast your vote.
- Once you vote, you’ll see **real-time updates** reflecting in all connected users' screens.

#### ⏳ Poll Control
- The poll automatically ends after **60 seconds**.
- However, the **poll creator** can choose to end it **manually at any time** before that.

---


