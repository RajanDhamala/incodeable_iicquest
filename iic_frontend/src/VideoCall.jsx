import { useEffect, useRef, useState } from "react"
import {Mic,MicOff,Video,VideoOff,Phone,PhoneOff,MessageCircle,Send,X,Users,PhoneIncoming,Clock,
} from "lucide-react"

const VideoCall = () => {
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { message: "Hey! Ready for the call?", sender: "John Doe", type: "received", timestamp: new Date().toISOString() },
    { message: "Yes, let's start!", sender: "You", type: "sent", timestamp: new Date().toISOString() },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isInCall, setIsInCall] = useState(true)
  const [incomingCall, setIncomingCall] = useState(null)
  const [callTimeout, setCallTimeout] = useState(30)
  const [isCallExpiring, setIsCallExpiring] = useState(false)
  const [notification, setNotification] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  const localVideoRef = useRef()
  const remoteVideoRef = useRef()
  const localStreamRef = useRef(null)
  const chatEndRef = useRef(null)
  const timeoutRef = useRef(null)
  const countdownRef = useRef(null)
  const isChatOpenRef = useRef(isChatOpen)

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        if (remoteVideoRef.current) {
          const canvas = document.createElement("canvas")
          canvas.width = 640
          canvas.height = 480
          const ctx = canvas.getContext("2d")

          const placeholderStream = canvas.captureStream(30)
          remoteVideoRef.current.srcObject = placeholderStream
        }

        setIsInitialized(true)
        showNotification("Camera initialized successfully", "info")
      } catch (err) {
        console.error("Error accessing media devices.", err)
        showNotification("Failed to access camera/microphone", "error")
      }
    }

    initializeCamera()

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleCall = () => {
    if (!isInitialized) {
      showNotification("Please wait for camera to initialize", "warning")
      return
    }

    setIsInCall(true)
    showNotification("Call started", "info")
  }

  const handleEndCall = () => {
    setIsInCall(false)
    showNotification("Call ended", "info")
  }

  const simulateIncomingCall = () => {
    setIncomingCall({ callerId: "user_12345" })
    setCallTimeout(30)
    setIsCallExpiring(false)
    startCallTimeout()
  }

  const startCallTimeout = () => {
    let timeLeft = 30
    setCallTimeout(timeLeft)

    countdownRef.current = setInterval(() => {
      timeLeft -= 1
      setCallTimeout(Math.max(0, timeLeft))

      if (timeLeft <= 10 && timeLeft > 0) {
        setIsCallExpiring(true)
      }

      if (timeLeft <= 0) {
        clearInterval(countdownRef.current)
        autoRejectCall()
      }
    }, 1000)

    timeoutRef.current = setTimeout(() => {
      autoRejectCall()
    }, 30000)
  }

  const clearCallTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setCallTimeout(30)
    setIsCallExpiring(false)
  }

  const autoRejectCall = () => {
    setIncomingCall(null)
    clearCallTimeout()
    showNotification("Call expired", "warning")
  }

  const acceptCall = () => {
    setIncomingCall(null)
    clearCallTimeout()
    setIsInCall(true)
    showNotification("Call accepted", "info")
  }

  const declineCall = () => {
    setIncomingCall(null)
    clearCallTimeout()
    showNotification("Call declined", "info")
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioMuted(!audioTrack.enabled)
        showNotification(audioTrack.enabled ? "Microphone on" : "Microphone off", "info")
      }
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoMuted(!videoTrack.enabled)
        showNotification(videoTrack.enabled ? "Camera on" : "Camera off", "info")
      }
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage,
        sender: "You",
        timestamp: new Date().toISOString(),
        type: "sent",
      }

      setMessages((prev) => [...prev, messageData])
      setNewMessage("")

      // Simulate receiving a response after a delay
      setTimeout(
        () => {
          const responses = ["Got it!", "Thanks for the message", "I agree", "Sounds good", "Let me think about that"]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]

          setMessages((prev) => [
            ...prev,
            {
              message: randomResponse,
              sender: "John Doe",
              timestamp: new Date().toISOString(),
              type: "received",
            },
          ])

          if (!isChatOpenRef.current) {
            setUnreadCount((prev) => prev + 1)
          }
        },
        1000 + Math.random() * 2000,
      )
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  useEffect(() => {
    isChatOpenRef.current = isChatOpen
    if (isChatOpen) {
      setUnreadCount(0)
    }
  }, [isChatOpen])

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">
      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-sm w-full mx-4 text-center border border-gray-600 shadow-2xl">
            <div className="mb-4">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isCallExpiring ? "bg-red-600/20 text-red-400 animate-pulse" : "bg-blue-600/20 text-blue-400"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{callTimeout}s</span>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center relative shadow-lg">
                <PhoneIncoming className="w-14 h-14 text-white" />
                <div className="absolute inset-0 rounded-full border-4 border-green-400/60 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-4 border-green-400/40 animate-ping animation-delay-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-green-400/20 animate-ping animation-delay-400"></div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 text-white">Incoming Call</h3>
            <p className="text-gray-300 mb-2 font-medium">From:</p>
            <p className="text-blue-400 mb-6 font-mono text-sm break-all bg-gray-800/50 px-3 py-2 rounded-lg">
              {incomingCall.callerId}
            </p>

            <div className="flex gap-6 justify-center">
              <button
                onClick={declineCall}
                className="group relative w-18 h-18 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-500/25"
              >
                <PhoneOff className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-red-400/20 animate-pulse"></div>
              </button>

              <button
                onClick={acceptCall}
                className="group relative w-18 h-18 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-500/25 animate-pulse"
              >
                <Phone className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-green-400/20 animate-pulse animation-delay-300"></div>
              </button>
            </div>

            {isCallExpiring && (
              <div className="mt-4 text-red-400 text-sm font-medium animate-pulse">Call will expire soon!</div>
            )}
          </div>
        </div>
      )}

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative lg:h-screen">
        {/* Header */}
        <div className="bg-gray-800 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="w-4 h-4" />
            <span className="font-mono break-all">ID: demo_user_123</span>
            {!isInitialized && <span className="text-yellow-400 text-xs">(Initializing...)</span>}
          </div>
          {isInCall && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Connected
            </div>
          )}
          <button onClick={simulateIncomingCall} className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
            Simulate Incoming Call
          </button>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative bg-black">
          {/* Remote Video */}
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-[90vh] object-cover scale-x-[-1]" />

          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-28 h-22 sm:w-32 sm:h-24 lg:w-40 lg:h-30 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
            {isVideoMuted && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-3 sm:gap-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              {/* Audio Toggle */}
              <button
                onClick={toggleAudio}
                className={`p-2 sm:p-3 rounded-full transition-colors ${
                  isAudioMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {isAudioMuted ? (
                  <MicOff className="w-6 h-6 sm:w-5 sm:h-5" />
                ) : (
                  <Mic className="w-6 h-6 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Video Toggle */}
              <button
                onClick={toggleVideo}
                className={`p-2 sm:p-3 rounded-full transition-colors ${
                  isVideoMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {isVideoMuted ? (
                  <VideoOff className="w-6 h-6 sm:w-5 sm:h-5" />
                ) : (
                  <Video className="w-6 h-6 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Call/End Call */}
              {isInCall ? (
                <button
                  onClick={handleEndCall}
                  className="p-2 sm:p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <PhoneOff className="w-6 h-6 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <button
                  onClick={handleCall}
                  disabled={!isInitialized}
                  className={`p-2 sm:p-3 rounded-full transition-colors ${
                    isInitialized ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Phone className="w-6 h-6 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Chat Toggle */}
              <button
                onClick={() => setIsChatOpen((prev) => !prev)}
                className={`p-2 sm:p-3 rounded-full transition-colors lg:hidden relative ${
                  isChatOpen ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={`
          ${isChatOpen ? "flex" : "hidden"} lg:flex
          flex-col w-full lg:w-80 xl:w-96 bg-gray-800 border-l border-gray-700
          fixed lg:relative bottom-0 lg:bottom-auto right-0 lg:right-auto z-10 lg:z-auto
          h-[calc(100%-80px)] lg:h-full
          top-auto lg:top-0
        `}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center lg:hidden">
                {unreadCount}
              </span>
            )}
          </h3>
          <button onClick={() => setIsChatOpen(false)} className="lg:hidden p-1 hover:bg-gray-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 text-sm">No messages yet. Start a conversation!</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-sm px-3 py-2 rounded-lg text-sm ${
                    msg.type === "sent" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <div className="font-medium text-xs opacity-75 mb-1">{msg.sender}</div>
                  <div>{msg.message}</div>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === "error"
                ? "bg-red-900/90 border-red-500 text-red-100"
                : notification.type === "warning"
                  ? "bg-yellow-900/90 border-yellow-500 text-yellow-100"
                  : "bg-blue-900/90 border-blue-500 text-blue-100"
            } backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{notification.message}</p>
              <button onClick={() => setNotification(null)} className="ml-3 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  )
}

export default VideoCall
