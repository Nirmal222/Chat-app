import React, { useState, useCallback } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import axiosInstance from "@/utils/axios";
import { IUser } from "@/interfaces/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

const SearchBox = () => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<IUser[]>([]);

    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            if (term) {
                const response = await axiosInstance.get(`/users/search?query=${term}`);
                setResults(response.data);
            } else {
                setResults([]);
            }
        }, 300),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedSearch(term);
    };

    const handleUserClick = (userId: string) => {
        router.push(`/user/${userId}`);
    };

    return (
        <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {results.length > 0 && (
                <div className="absolute mt-1 w-full rounded-lg bg-background shadow-lg">
                    {results.map((result, index) => (
                        <div key={index} className="flex items-center gap-4 m-4 cursor-pointer border-2 p-4 rounded-lg" onClick={() => handleUserClick(result?._id)}>
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                    {result?.username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {result?.email}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBox;