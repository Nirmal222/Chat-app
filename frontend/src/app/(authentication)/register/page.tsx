"use client";
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/utils/axios";

export default function Register() {
    const router = useRouter()
    const [formData, setFormData] = useState<{ username: string; email: string; password: string }>({
        username: "",
        email: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: { target: { id: string; value: string; }; }) => {
        const { id, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }))
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await axiosInstance.post("/auth/signup", {
                data: JSON.stringify(formData),
            })

            if (response.status >= 200 && response.status < 300) {
                toast.success("Registration successful! Redirecting you to login...")
                setTimeout(() => {
                    router.push("/login")
                }, 1500)
            } else {
                throw new Error('Registration failed')
            }
        } catch (err) {
            toast.error('An error occurred during registration. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="hidden bg-muted lg:flex items-center justify-center">
                <h1 className="text-black text-6xl font-bold">LOGO</h1>
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Register</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your details below to register your account
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="Enter Name"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create an account"}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}