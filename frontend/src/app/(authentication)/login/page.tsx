'use client';
import { useState } from "react"
import Link from 'next/link'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/utils/axios";
import { redirect, useRouter } from "next/navigation";
import useStorage from "@/hooks/useSessionStorage";
import axios from "axios";

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { getItem } = useStorage()
    const token = getItem('token', 'session');
    const userId = getItem('userId', 'session');

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await axiosInstance.post("/auth/login", { data: { email, password } })
            if (response.status >= 200 && response.status < 300) {
                const { token, userId, username } = response.data

                sessionStorage.setItem('token', token);
                sessionStorage.setItem('userId', userId);
                sessionStorage.setItem('username', username);

                toast.success("Login successful! Redirecting you to connect.")

                setTimeout(() => {
                    router.push("/connections")
                }, 1500)
            } else {
                throw new Error('Login failed')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 401) {
                    toast.warning("Credentials not found. Please,", {
                        description: <Link href="/register" className="underline font-semibold text-blue">Signup</Link>,
                      })
                    return 
                }
                toast.error(error.message)
            } else {
                toast.error("An unexpected error occurred.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    if(token && userId){
        redirect("/")
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="hidden bg-muted lg:flex items-center justify-center">
                <h1 className="text-black text-6xl font-bold">LOGO</h1>
            </div>
            <div className="flex items-center justify-center py-12">
                <form onSubmit={handleLogin} className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}