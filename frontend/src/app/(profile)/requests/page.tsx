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
    id: string;
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
                recepient: userId,
                status: "pending"
            });
            setRequests(response?.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    // const handleAccept = async (id: string) => {
    //     try {
    //         await api.acceptRequest(id);
    //         setRequests(requests.filter(request => request.id !== id));
    //     } catch (error) {
    //         console.error('Error accepting request:', error);
    //     }
    // };

    // const handleReject = async (id: string) => {
    //     try {
    //         await api.rejectRequest(id);
    //         setRequests(requests.filter(request => request.id !== id));
    //     } catch (error) {
    //         console.error('Error rejecting request:', error);
    //     }
    // };

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
                                    <Button onClick={() => ""} variant="default">Accept</Button>
                                    <Button onClick={() => ""} variant="outline">Reject</Button>
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