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

interface ConnectionRequest {
    _id: string;
    status: 'pending' | 'accepted' | 'rejected';
    username: string;
}

const ConnectionRequestsScreen: React.FC = () => {
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const { getItem } = useStorage();
    const userId = getItem('userId', 'session');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/connections/requests`, {
                recipient: userId,
                status: "pending"
            });
            setRequests(response?.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id: string) => {
        try {
            await axiosInstance.patch(`/connections/respond`, { connectionId: id, status: 'accepted' });
            setRequests(requests.filter(request => request._id !== id));
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await axiosInstance.patch(`/connections/respond`, { connectionId: id, status: 'rejected' });
            setRequests(requests.filter(request => request._id !== id));
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Connection Requests</CardTitle>
                <CardDescription>You have {requests.length} pending connection requests</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading requests...</p>
                ) : (
                    <ScrollArea className="h-[400px] pr-4 -mr-4">
                        {requests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src={""} alt={request.username} />
                                        <AvatarFallback>{request.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{request.username}</h3>
                                    </div>
                                </div>
                                {request?.status == 'pending' && <div className="space-x-2">
                                    <Button onClick={() => handleAccept(request?._id)} variant="default">Accept</Button>
                                    <Button onClick={() => handleReject(request?._id)} variant="outline">Reject</Button>
                                </div>}
                            </div>
                        ))}
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};

export default ConnectionRequestsScreen;