'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, GraduationCap, MessageCircle, UserPlus } from 'lucide-react';
import axiosInstance from '@/utils/axios';
import axios from 'axios';
import useStorage from '@/hooks/useSessionStorage';
import { toast } from 'sonner';
import MessagingPopup from '../components/message-popup';

interface ProfileProps {
    params: {
        user_id: string;
    };
}

interface UserData {
    username: string;
    email: string;
}

const Profile = ({ params }: ProfileProps) => {
    const { getItem } = useStorage()
    const currentUserId = getItem('userId');
    const { user_id } = params

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messagePopup, setMessagesPopup] = useState<boolean>(false);

    const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
    const fetchConnectionStatus = async (currentUserId: string, profileUserId: string) => {
        try {
            const response = await axiosInstance.get(`/connections/${currentUserId}/${profileUserId}`);
            if (response.status === 200 || response.status === 201) {

                setConnectionStatus(response.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 404) {
                    setConnectionStatus('not_connected');
                } else {
                    console.error('Error fetching connection status:', error);
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance(`/users/${user_id}`);
                if (response.status >= 200 && response.status < 300) {
                    const data = response.data;
                    setUserData(data);
                    setError(null);
                    await fetchConnectionStatus(currentUserId, user_id);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (err) {
                setError('Error fetching user data. Please try again later.');
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user_id]);

    const renderConnectionButton = () => {
        switch (connectionStatus) {
            case 'pending':
                return <Button variant="outline" disabled>Pending</Button>;
            case 'accepted':
                return <Button onClick={() => setMessagesPopup(true)} variant="outline">Message</Button>;
            case 'not_connected':
            default:
                return <Button onClick={handleConnect}>Connect</Button>;
        }
    };

    const handleConnect = async () => {
        const toastId = toast.loading(`Sending request...`, {
            description: 'Please do not close the tab!',
        })
        try {
            await axiosInstance.post('/connections/request', {
                requesterId: currentUserId,
                recipientId: user_id
            });
            setConnectionStatus('pending');
            toast.dismiss(toastId)
            const successToastId = toast.success(`requested successfully`)
            toast.dismiss(successToastId)
        } catch (error) {
            console.error('Error sending connection request:', error);
            const errorToastId = toast.error(`Error sending request`)
            toast.dismiss(errorToastId)
            throw new Error(
                `Error sending request: ${error instanceof Error ? error.message : String(error)
                }`
            )
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    if (!userData) {
        return <div className="text-center mt-8">No user data found.</div>;
    }
    return (
        <div className="max-w-full p-4 space-y-4">
            <Card>
                <CardHeader className="relative">
                    <div className="h-32 bg-black rounded-t-lg"></div>
                    <Avatar className="w-32 h-32 absolute bottom-0 left-4 translate-y-1/2 border-4 border-white">
                        <AvatarImage src="/api/placeholder/150/150" alt="Profile picture" />
                        <AvatarFallback>PD</AvatarFallback>
                    </Avatar>
                </CardHeader>
                <CardContent className="mt-16">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold">{userData?.username}</CardTitle>
                            <CardDescription className="text-lg">Software Engineer at Tech Co.</CardDescription>
                            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                                <MapPin size={16} />
                                <span>San Francisco Bay Area</span>
                            </div>
                        </div>
                        <div className="space-x-2">
                            {renderConnectionButton()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Passionate software engineer with 5+ years of experience in full-stack development.
                        Specializing in React, Node.js, and cloud technologies. Always eager to learn and
                        tackle new challenges in the ever-evolving tech landscape.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start space-x-4">
                        <Briefcase className="mt-1" />
                        <div>
                            <h3 className="font-semibold">Senior Software Engineer</h3>
                            <p className="text-sm text-gray-500">Tech Co. · Full-time</p>
                            <p className="text-sm text-gray-500">Jan 2020 - Present · 3 yrs 6 mos</p>
                            <p className="mt-2">Leading development of scalable web applications using React and Node.js.</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-start space-x-4">
                        <Briefcase className="mt-1" />
                        <div>
                            <h3 className="font-semibold">Software Developer</h3>
                            <p className="text-sm text-gray-500">StartUp Inc. · Full-time</p>
                            <p className="text-sm text-gray-500">Jun 2017 - Dec 2019 · 2 yrs 7 mos</p>
                            <p className="mt-2">Developed and maintained web applications for various clients.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start space-x-4">
                        <GraduationCap className="mt-1" />
                        <div>
                            <h3 className="font-semibold">Bachelor of Science in Computer Science</h3>
                            <p className="text-sm text-gray-500">University of Technology</p>
                            <p className="text-sm text-gray-500">2013 - 2017</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Badge>React</Badge>
                        <Badge>Node.js</Badge>
                        <Badge>JavaScript</Badge>
                        <Badge>TypeScript</Badge>
                        <Badge>AWS</Badge>
                        <Badge>Docker</Badge>
                        <Badge>Git</Badge>
                        <Badge>Agile</Badge>
                    </div>
                </CardContent>
            </Card>

            {messagePopup && <MessagingPopup setMessagesPopup={setMessagesPopup} currentUserId={currentUserId} recipientId={user_id} recipientName={userData?.username} />}
        </div>
    );
};

export default Profile;