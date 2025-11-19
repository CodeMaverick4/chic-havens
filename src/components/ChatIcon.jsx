import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { db } from "../firebase";
import { ref, push, onChildAdded, update, get, query, orderByKey } from "firebase/database";

const ChatBot = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [needUserDetails, setNeedUserDetails] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  // Reset state when a new user logs in
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setChatId(null);
      setName("");
      setPhone("");
      setNeedUserDetails(false);
      return;
    }

    setChatId(user.chatId || null);
    setName(user.name || "");
    setPhone(user.phone || "");
    setMessages([]);
    setNeedUserDetails(false);
  }, [user]);

  // Check chat existence & messages
  useEffect(() => {
    if (!chatId) return;

    const chatRef = ref(db, `chic-havens-enquiries/${chatId}`);
    get(chatRef).then((snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        if (!chatData.messages || Object.keys(chatData.messages).length === 0) {
          setNeedUserDetails(true);
          setName(chatData.user?.name || "");
          setPhone(chatData.user?.phone || "");
        }
      } else {
        setNeedUserDetails(true);
      }
    });
  }, [chatId]);

  // Listen for messages
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = query(ref(db, `chic-havens-enquiries/${chatId}/messages`), orderByKey());
    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const msg = snapshot.val();
      setMessages((prev) => [...prev, msg]);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Save user details with validation
  const handleSaveUserDetails = async () => {
    if (name.trim().length < 3 || name.trim().length > 50) {
      return alert("Name must be between 3 and 50 characters.");
    }

    const phonePattern = /^[0-9]{10}$/; // exactly 10 digits
    if (!phonePattern.test(phone)) {
      return alert("Phone number must be 10 digits.");
    }

    setLoading(true);

    try {
      const chatUserRef = ref(db, `chic-havens-enquiries/${chatId}/user`);
      await update(chatUserRef, { name, phone });

      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { displayName: name, phone });

      setNeedUserDetails(false);
    } catch (err) {
      console.error("Error updating user details:", err);
    }

    setLoading(false);
  };

  // Send message with validation
  const handleSend = async () => {
    if (!input.trim() || !user || !chatId) return;
    if (input.length > 200) return alert("Message cannot exceed 200 characters.");

    const messagesRef = ref(db, `chic-havens-enquiries/${chatId}/messages`);
    await push(messagesRef, {
      text: input.trim(),
      sender: "user",
      timestamp: Date.now(),
    });

    setInput("");
  };

  return (
    <>
      {/* Chat Icon */}
      <div className="chat-icon-container" onClick={toggleChat}>
        <div className="chat-icon-wrapper">
          <img src="/chat-bot-icon.png" alt="Chat Bot" className="chat-icon" />
          {!isOpen && (
            <span className="chat-icon-badge">
              <i className="bi bi-chat-dots-fill"></i>
            </span>
          )}
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window shadow-lg">
          {/* Header */}
          <div className="chat-header">
            <div className="d-flex align-items-center gap-2">
              <div className="chat-header-icon">
                <i className="bi bi-headset"></i>
              </div>
              <div>
                <strong className="d-block mb-0">Chic Havens Support</strong>
                <small className="chat-status">
                  <span className="status-dot"></span>
                  Online
                </small>
              </div>
            </div>
            <button className="chat-close-btn" onClick={toggleChat}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Body */}
          <div className="chat-body">
            {!user ? (
              /* Not Logged In */
              <div className="chat-empty-state">
                <div className="text-center">
                  <i className="bi bi-lock-fill fs-1 text-muted mb-3"></i>
                  <h6 className="fw-semibold mb-2">Authentication Required</h6>
                  <p className="text-muted small mb-0">
                    Please sign in to start chatting with our support team
                  </p>
                </div>
              </div>
            ) : needUserDetails ? (
              /* User Details Form */
              <div className="chat-user-form">
                <div className="text-center mb-3">
                  <i className="bi bi-person-circle fs-1 text-primary mb-2"></i>
                  <h6 className="fw-semibold mb-1">Welcome!</h6>
                  <p className="text-muted small mb-0">
                    Please provide your details to continue
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={name}
                      maxLength={50}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="10-digit phone number"
                      value={phone}
                      maxLength={10}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary w-100 btn-sm"
                  onClick={handleSaveUserDetails}
                  disabled={loading || !name.trim() || phone.length !== 10}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Start Chat
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Messages */
              <div className="messages">
                {messages.length === 0 ? (
                  <div className="chat-welcome-message">
                    <div className="bot-msg">
                      <i className="bi bi-robot me-2"></i>
                      Hi there! 👋 How can I help you today?
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const formatedDate = new Date(1761734986304).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                    return (
                      // <div key={idx} className={`border message-wrapper ${msg.sender === "user" ? "user-wrapper" : "bot-wrapper" }`}>
                          <div key={idx} className={`d-flex flex-column w-100 ${msg.sender === 'admin' ? 'align-items-start' : 'align-items-end'} `}>
                            <div className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}> {msg.text} </div>
                            <small style={{fontSize:'8px'}}>{formatedDate.toLocaleString()}</small>
                          </div>                          
                      // </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer */}
          {!needUserDetails && user && (
            <div className="chat-footer">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control chat-input"
                  placeholder="Type your message..."
                  value={input}
                  maxLength={200}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                />
                <button
                  className="btn btn-primary chat-send-btn"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
              <div className="text-center mt-2">
                <small className="text-muted">
                  Press Enter to send
                </small>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

};

export default ChatBot;
