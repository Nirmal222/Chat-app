'use client';
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosInstance from '@/utils/axios';
import useStorage from '@/hooks/useSessionStorage';
import { useRouter } from 'next/navigation';

interface Connection {
    _id: string;
    status: 'pending' | 'accepted' | 'rejected';
    username: string;
    requester: string;
}

const ConnectionsScreen: React.FC = () => {
    const router = useRouter()
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const { getItem } = useStorage();
    const userId = getItem('userId', 'session');

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance(`/connections/${userId}`);  
            console.log(response);
            setConnections(response?.data);
        } catch (error) {
            console.error('Error fetching connections:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Your Connections</CardTitle>
                <CardDescription>You have {connections.length} connections</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading connections...</p>
                ) : (
                    <ScrollArea className="h-[400px] pr-4 -mr-4">
                        {connections.map((connection) => (
                            <div key={connection._id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src={""} alt={connection.username} />
                                        <AvatarFallback>{connection.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{connection.username}</h3>
                                    </div>
                                </div>
                                    <Button onClick={() => router.push(`/user/${connection?.requester}`)} variant="default">Show Profile</Button>
                            </div>
                        ))}
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};

export default ConnectionsScreen;