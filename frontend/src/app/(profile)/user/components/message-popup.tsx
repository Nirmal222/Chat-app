import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import axiosInstance from '@/utils/axios';

// Define types for our component props and message structure
interface MessagingPopupProps {
    currentUserId: string;
    recipientId: string;
    recipientName: string;
    recipientAvatar?: string;
    setMessagesPopup?: (value:boolean) => void
}

interface Message {
    sender: string;
    recipient: string;
    content: string;
    _id?: string;
    createdAt?: string;
}

const MessagingPopup: React.FC<MessagingPopupProps> = ({
    currentUserId,
    recipientId,
    recipientName,
    recipientAvatar,
    setMessagesPopup,
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);

    const fetchChatHistory = async () => {
        try {
            const response = await axiosInstance.get(`/messages/chat/${currentUserId}/${recipientId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch chat history');
            }
            setMessages(response?.data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    useEffect(() => {
        fetchChatHistory();

        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');
        setSocket(newSocket);
        newSocket.emit('user_connected', currentUserId);

        newSocket.on('new_message', (message: Message) => {
            console.log("received new message", message);
            if (message.sender === recipientId || message.sender === currentUserId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        newSocket.on('typing', ({ senderId }) => {
            if (senderId === recipientId) {
                setIsTyping(true);
            }
        });

        newSocket.on('stop_typing', ({ senderId }) => {
            if (senderId === recipientId) {
                setIsTyping(false);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [currentUserId, recipientId]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (inputMessage.trim() && socket) {
            const newMessage = {
                sender: currentUserId,
                recipient: recipientId,
                content: inputMessage,
            };
            socket.emit('send_message', newMessage);
            setInputMessage('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
        if (socket) {
            socket.emit('typing', { senderId: currentUserId, recipientId });
            setTimeout(() => {
                socket.emit('stop_typing', { senderId: currentUserId, recipientId });
            }, 2000);
        }
    };
    return (
        <Card className="w-80 h-96 fixed bottom-0 right-0 flex flex-col  shadow-lg">
            <CardHeader className="px-3 py-2 bg-black text-white rounded-t-lg">
                <div className='flex justify-between'>
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={recipientAvatar} alt={recipientName} />
                            <AvatarFallback>{recipientName[0]}</AvatarFallback>
                        </Avatar>
                        <span>{recipientName}</span>
                    </div>
                    <Button onClick={() =>  setMessagesPopup?.(false)} variant="ghost" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-3">
                <ScrollArea className="h-full pr-4 -mr-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={`mb-2 ${message.sender === currentUserId ? 'text-right' : 'text-left'
                                    }`}
                            >
                                <span
                                    className={`inline-block p-2 rounded-lg ${message.sender === currentUserId
                                        ? 'bg-slate-600 text-white rounded-r-xl rounded-b-xl'
                                        : 'bg-gray-200 text-gray-800 rounded-l-xl rounded-b-xl'
                                        }`}
                                >
                                    {message.content}
                                </span>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="text-gray-500 text-sm">
                                {recipientName} is typing...
                            </div>
                        )}
                    </div>
                    <div ref={messageEndRef} />
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-3">
                <div className="flex w-full">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={handleInputChange}
                        className="flex-grow mr-2"
                    />
                    <Button onClick={handleSendMessage}><Send /></Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default MessagingPopup;
