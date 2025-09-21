// src/components/header.tsx
"use client"

import { Bell, LogOut, Search, Settings, User } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { SidebarTrigger } from "./ui/sidebar"
import { Badge } from "./ui/badge"
import { useAuth } from "@/contexts/auth-context"


export const Header = () => {
    const auth = useAuth();
  return (
    <>
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                    <SidebarTrigger/>

                    <div className="hidden md:block ml-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={auth.user?.avatar || "/placeholder.svg"} alt="User" />
                                    <AvatarFallback>
                                        {auth.user?.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <div className=" flex items-center space-x-2">
                                        <p className="text-sm font-medium leading-none">{auth.user?.name}</p>
                                        <Badge>{auth.user?.globalRole}</Badge>
                                    </div>
                                    <p className="text-xs leading-none text-muted-foreground">{auth.user?.email}</p>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    </>
  )
}

