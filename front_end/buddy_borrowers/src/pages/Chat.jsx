import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Chat.css";

const BASE_URL = "http://127.0.0.1:8000";

function Chat() {

    const { requestId } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const socketRef = useRef(null);


    // =========================
    // GET CURRENT USER
    // =========================

    useEffect(() => {

        const fetchCurrentUser = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {

                const response = await axios.get(
                    `${BASE_URL}/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("CURRENT USER:", response.data);

                setCurrentUserId(response.data.user_id);

            } catch (error) {

                console.error(
                    "Could not fetch current user:",
                    error
                );

            }
        };

        fetchCurrentUser();

    }, [navigate]);


    // =========================
    // WEBSOCKET CONNECTION
    // =========================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        const socket = new WebSocket(
            `ws://127.0.0.1:8000/chat/${requestId}?token=${token}`
        );

        socketRef.current = socket;


        socket.onopen = () => {
            console.log("CHAT CONNECTED");
        };


        socket.onmessage = (event) => {

            const data = JSON.parse(event.data);

            console.log("MESSAGE RECEIVED:", data);

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    message: data.message,
                    sender_id: data.sender_id
                }
            ]);

        };


        socket.onerror = (error) => {
            console.error(
                "WEBSOCKET ERROR:",
                error
            );
        };


        socket.onclose = () => {
            console.log("CHAT DISCONNECTED");
        };


        return () => {
            socket.close();
        };

    }, [requestId, navigate]);


    // =========================
    // SEND MESSAGE
    // =========================

    const sendMessage = () => {

        if (!message.trim()) {
            return;
        }

        if (
            !socketRef.current ||
            socketRef.current.readyState !== WebSocket.OPEN
        ) {

            console.error(
                "WebSocket is not connected."
            );

            return;
        }


        socketRef.current.send(message);

        setMessage("");
    };


    // =========================
    // UI
    // =========================

    return (

        <div className="chat-page">

            {/* HEADER */}

            <div className="chat-header">

                <button
                    className="chat-back"
                    onClick={() => navigate("/home")}
                >
                    ← Back
                </button>

                <h1>Chat</h1>

            </div>


            {/* MESSAGES */}

            <div className="chat-messages">

                {messages.map((msg, index) => {

                    const isMine =
                        Number(msg.sender_id) ===
                        Number(currentUserId);

                    return (

                        <div
                            key={index}
                            className={
                                isMine
                                    ? "message-row mine"
                                    : "message-row theirs"
                            }
                        >

                            <div
                                className={
                                    isMine
                                        ? "message-bubble purple-bubble"
                                        : "message-bubble white-bubble"
                                }
                            >

                                {msg.message}

                            </div>

                        </div>

                    );

                })}

            </div>


            {/* INPUT */}

            <div className="chat-input-area">

                <input
                    type="text"
                    value={message}
                    placeholder="Type a message..."
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            sendMessage();
                        }

                    }}
                />

                <button
                    className="chat-send"
                    onClick={sendMessage}
                >
                    Send
                </button>

            </div>

        </div>

    );
}

export default Chat;