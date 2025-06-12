import { useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {Plus,Users,MessageCircle,Search,Settings,X,Send,Loader2,Smile,ImageIcon,ChevronLeft,Info,Bell,Menu,User,Check,Phone,Video,AlertCircle,UserPlus,
} from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function ChatApp() {
  const { user, loading } = useUser()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [imageToUpload, setImageToUpload] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [newMemberUserId, setNewMemberUserId] = useState("")
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const [newGroup, setNewGroup] = useState({
    groupName: "",
    groupDescription: "",
  });
  const [globalMessage, setglobalMessage] = useState();
  const [selectedUserId, setSelectedUserId] = useState(null)

  const queryClient = useQueryClient()
  const navigate = useNavigate()
   const [isOpen, setIsOpen] = useState(false);


  function webrtc() {
    navigate("/call")
  }

  const handelDbcall=(user)=>{
        console.log(user)
  }
  const {
    data: groups = [],
    isLoading: groupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ["groups", user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      try {
        const response = await axios.post("api/getgroup/", {
          userID: user.id,
        })
        console.log("API Response:", response.data)
        const groupsData = response.data?.data || []
  

        return Array.isArray(groupsData) ? groupsData : []
      } catch (error) {
        console.error("Error fetching groups:", error)
        return []
      }
    },
    enabled: !!user?.id,
    staleTime: 30000,
    retry: 1,
  })
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", selectedGroup?.id, selectedUserId],
    queryFn: async () => {
      if (!selectedGroup?.id) return []
      try {
        const requestBody = {
          groupID: selectedGroup.id,
        }
      
        if (selectedUserId) {
          requestBody.userID = selectedUserId
        }
        
        const response = await axios.post("api/getgroupchat/", requestBody)

        const messagesData = response.data?.data || []
        const groupUsersData = response.data?.groupUsers;
        setglobalMessage(groupUsersData);
        return Array.isArray(messagesData) ? messagesData : []
      } catch (error) {
        console.error("Error fetching messages:", error)
        return []
      }
    },
    enabled: !!selectedGroup?.id,
    refetchInterval: 3000,
    staleTime: 3000,
    retry: 1,
  })

  const sendMessageMutation = useMutation({
  mutationFn: async (messageData) => {
    if (messageData.image) {
      const formData = new FormData();
      formData.append("groupID", messageData.groupID);
      formData.append("sender", user.id);
      formData.append("message", messageData.message);
      formData.append("picture", messageData.image);

      const response = await axios.post("api/groupchat/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      const response = await axios.post("api/groupchat/", {
        groupID: messageData.groupID,
        sender: user.id,
        message: messageData.message,
        picture: false,
      });
      return response.data;
    }
  },

  onMutate: async (messageData) => {
    const groupID = messageData.groupID;

    await queryClient.cancelQueries(["messages", groupID]);

    const previousMessages = queryClient.getQueryData(["messages", groupID]);

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      groupID,
      sender: user.id,
      message: messageData.message,
      picture: messageData.image ? URL.createObjectURL(messageData.image) : null,
      timestamp: new Date().toISOString(),
      optimistic: true,
    };

    queryClient.setQueryData(["messages", groupID], (old = []) => [
      ...old,
      optimisticMessage,
    ]);
    setMessageText("");
    return { previousMessages };
  },

  onError: (error, _data, context) => {
    if (context?.previousMessages) {
      queryClient.setQueryData(["messages", _data.groupID], context.previousMessages);
    }
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again.");
  },

  onSettled: (_data, _error, variables) => {
    queryClient.invalidateQueries(["messages", variables.groupID]);
  },
});


  const createGroupMutation = useMutation({
    mutationFn: async (groupData) => {
      const response = await axios.post("/api/creategroup/", {
        groupName: groupData.groupName,
        groupDescription: groupData.groupDescription,
        userID: user.id,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["groups", user?.id])
      setShowCreateModal(false)
      setNewGroup({ groupName: "", groupDescription: "" })
    },
    onError: (error) => {
      console.error("Error creating group:", error)
      alert("Error during creation of the chat group")
    },
  })

  const addMemberMutation = useMutation({
    mutationFn: async (memberData) => {
      const response = await axios.post("api/addgroupmember/", {
        groupID: memberData.groupID,
        userID: memberData.userID,
      })
      return response.data
    },
    onSuccess: () => {
      setShowAddMemberModal(false)
      setNewMemberUserId("")
      alert("Member added successfully!")
    },
    onError: (error) => {
      console.error("Error adding member:", error)
      alert("Failed to add member. Please check the User ID and try again.")
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (selectedGroup && showMobileSidebar) {
      setShowMobileSidebar(false)
    }
  }, [selectedGroup])

  const handleCreateGroup = (e) => {
    e.preventDefault()
    if (!newGroup.groupName.trim()) {
      alert("Group name is required")
      return
    }
    createGroupMutation.mutate(newGroup)
  }

  const handleAddMember = (e) => {
    e.preventDefault()
    if (!newMemberUserId.trim()) {
      alert("User ID is required")
      return
    }
    if (!selectedGroup?.id) {
      alert("No group selected")
      return
    }
    addMemberMutation.mutate({
      groupID: selectedGroup.id,
      userID: newMemberUserId.trim(),
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewGroup((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if ((!messageText.trim() && !imageToUpload) || !selectedGroup) return
   
    
    sendMessageMutation.mutate({
      groupID: selectedGroup.id,
      message: messageText.trim(),
    })
  }
  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
    setSelectedUserId(null) 
    setIsOpen(false) 
  }

  const handleUserSelect = (userId) => {
    setSelectedUserId(selectedUserId === userId ? null : userId) 
    setIsOpen(false) 
  }

  const getGroupInitials = (groupName) => {
    if (!groupName) return "G"
    return groupName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  const getUserInitials = (sender) => {
    if (!sender) return "U"
    return sender.substring(0, 2).toUpperCase()
  }

  const isMyMessage = (sender) => {
    return sender === user?.id
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const filteredGroups = Array.isArray(groups)
    ? groups.filter((group) => group.groupName?.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your chats...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
            Chat Groups
          </h1>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
        </div>


        <div
          className={`${
            showMobileSidebar ? "fixed inset-0 z-40 block" : "hidden"
          } lg:relative lg:block lg:w-80 xl:w-96 h-full`}
        >
          <div className="flex flex-col h-full bg-white shadow-lg lg:shadow-none">
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Chat Groups</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.firstName?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{user?.fullName || "User"}</h3>
                  <p className="text-sm text-gray-500 truncate">{user?.emailAddresses?.[0]?.emailAddress || ""}</p>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                  title="Create New Group"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {groupsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-500">Loading your groups...</p>
                </div>
              ) : groupsError ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load groups</h3>
                  <p className="text-gray-500">Please check your connection and try again</p>
                </div>
              ) : filteredGroups.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {searchTerm ? "No groups found" : "No groups joined yet"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {!searchTerm && "Create your first group to get started with messaging"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-2">
                  {filteredGroups.map((group, index) => (
                    <div
                      key={group.id || index}
                      onClick={() => handleGroupSelect(group)}
                      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                        selectedGroup?.id === group.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                    >
                      {/* Group Avatar */}
                      <div
                        className={`w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center text-white font-semibold text-lg mr-3 flex-shrink-0 ${
                          selectedGroup?.id === group.id
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-300"
                            : "bg-gradient-to-br from-gray-500 to-gray-600"
                        }`}
                      >
                        {getGroupInitials(group.groupName)}
                      </div>

                      {/* Group Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3
                            className={`font-medium truncate ${
                              selectedGroup?.id === group.id ? "text-blue-900" : "text-gray-900"
                            }`}
                          >
                            {group.groupName || "Unnamed Group"}
                          </h3>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">12:30 PM</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{group.groupDescription || "No description"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

     
        <div className="flex-1 flex flex-col h-full">
          {selectedGroup ? (
            <>
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {getGroupInitials(selectedGroup.groupName)}
                  </div>                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedGroup.groupName}</h2>
                    {selectedUserId && (
                      <p className="text-sm text-gray-500">
                        Viewing messages from: {globalMessage?.find(m => m.userID === selectedUserId)?.username || 'Selected User'}
                      </p>
                    )}
                  </div>
                </div>                <div className="flex items-center space-x-2">
                  {/* Group Users Display */}
                  <div className="flex items-center space-x-1 mr-2">
                    {globalMessage && globalMessage.length > 0 && (
                      <div className="flex -space-x-2">
                        {globalMessage.slice(0, 3).map((member, index) => (
                          <div
                            key={member.userID}
                            className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                            title={member.username}
                            onClick={() => handelDbcall(member)}
                          >
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {globalMessage.length > 3 && (
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-xs border-2 border-white">
                            +{globalMessage.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Options
                  </button>

                  {isOpen && (
                    <div className="absolute mt-12 bg-white border border-gray-200 rounded shadow w-60 z-10 right-0">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900">Group Members</h4>
                        </div>                        {globalMessage && globalMessage.length > 0 ? (
                          globalMessage.map((member) => (
                            <div
                              key={member.userID}
                              className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                                selectedUserId === member.userID ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                              }`}
                              onClick={() => handleUserSelect(member.userID)}
                            >
                              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                                {member.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-gray-700">{member.username}</span>
                              {selectedUserId === member.userID && (
                                <div className="ml-auto">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">No members found</div>
                        )}
                        <div className="border-t border-gray-200 mt-2">
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                            onClick={() => {
                              setSelectedUserId(null) // Clear filter to show all messages
                              setIsOpen(false)
                            }}
                          >
                            Show All Messages
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                            onClick={() => setShowAddMemberModal(true)}
                          >
                            Add Member
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="p-2 rounded-full hover:bg-green-50 transition-colors group"
                    title="Add Member"
                  >
                    <UserPlus className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={webrtc}>
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Info className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center space-y-4">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                      <p className="text-gray-600">Loading messages...</p>
                    </div>
                  </div>
                ) : messagesError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load messages</h3>
                      <p className="text-gray-500 mb-4">Please check your connection and try again</p>
                      <button
                        onClick={() => queryClient.invalidateQueries(["messages", selectedGroup?.id])}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageCircle className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No messages yet</h3>
                      <p className="text-gray-500 mb-6">
                        Be the first to send a message in this group! Share updates, files, or just say hello.
                      </p>
                      <div className="flex justify-center">
                        <button
                          onClick={() => document.getElementById("message-input")?.focus()}
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Start Conversation
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Date Separator */}
                    <div className="flex items-center justify-center">
                      <div className="bg-gray-200 px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-gray-600">Today</span>
                      </div>
                    </div>

                    {messages.map((message, index) => (
                      <div
                        key={message.id || index}
                        className={`flex ${isMyMessage(message.sender) ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex max-w-xs md:max-w-md lg:max-w-lg ${
                            isMyMessage(message.sender) ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${
                              isMyMessage(message.sender)
                                ? "ml-3 bg-gradient-to-br from-blue-500 to-blue-600"
                                : "mr-3 bg-gradient-to-br from-gray-500 to-gray-600"
                            }`}
                          >
                            {getUserInitials(message.sender)}
                          </div>                          <div
                            className={`rounded-2xl px-4 py-3 shadow-sm ${
                              isMyMessage(message.sender)
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white text-gray-900 rounded-tl-none"
                            } ${message.optimistic ? 'opacity-70' : ''}`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <div
                              className={`flex items-center justify-between mt-1 text-xs ${
                                isMyMessage(message.sender) ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              <span>{formatTime(message.timestamp)}</span>
                              {isMyMessage(message.sender) && (
                                <span className="flex items-center">
                                  {message.optimistic ? (
                                    <Loader2 className="w-3 h-3 animate-spin ml-1" />
                                  ) : (
                                    <Check className="w-3 h-3 ml-1" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>


              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              
                  <div className="flex-1 relative">
                    <input
                      id="message-input"
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
                      disabled={sendMessageMutation.isPending}
                    />

                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={(!messageText.trim() && !imageToUpload) || sendMessageMutation.isPending}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* No Group Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Chat Groups</h2>
                <p className="text-gray-600 mb-8">
                  Select a group from the sidebar to start chatting, or create a new group to connect with others.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Group
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600">
              <h3 className="text-xl font-bold text-white">Create New Group</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    name="groupName"
                    value={newGroup.groupName}
                    onChange={handleInputChange}
                    placeholder="Enter group name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="groupDescription"
                    name="groupDescription"
                    value={newGroup.groupDescription}
                    onChange={handleInputChange}
                    placeholder="What's this group about?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createGroupMutation.isPending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {createGroupMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600">
              <h3 className="text-xl font-bold text-white flex items-center">
                <UserPlus className="w-6 h-6 mr-2" />
                Add Member
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {getGroupInitials(selectedGroup?.groupName)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedGroup?.groupName}</h4>
                      <p className="text-sm text-gray-600">Adding member to this group</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="newMemberUserId" className="block text-sm font-medium text-gray-700 mb-2">
                    User ID *
                  </label>
                  <input
                    type="text"
                    id="newMemberUserId"
                    value={newMemberUserId}
                    onChange={(e) => setNewMemberUserId(e.target.value)}
                    placeholder="Enter user ID to add"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the exact User ID of the person you want to add to this group.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMemberMutation.isPending}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {addMemberMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

    </div>
  )
}

export default ChatApp
