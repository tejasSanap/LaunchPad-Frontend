"use client";
import React, { useContext } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
interface UserData {
  login: string;
  avatar_url?: string;
}
function Navbar() {
  const { setTheme } = useTheme();
  const { userData, isLoggedIn, logout } = useAuth() as {
    userData: UserData;
    isLoggedIn: boolean;
    logout: () => void;
  };
  const router = useRouter();

  const handleAuth = () => {
    if (isLoggedIn) {
      logout();
      router.push("/");
    } else {
      router.push("/login");
    }
  };
  return (
    <>
      <div className="flex justify-between items-center max-w-screen-xl mx-auto px-4 pt-4">
        <div className="flex items-center">
          <div className="text-center">
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              src="/images/logo.svg"
              alt="Launch Logo"
              width={40}
              height={40}
              priority
            />
          </div>
          <p
            className="cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            LaunchPad
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="link"
            onClick={() => {
              window.location.href = "https://github.com/tejasSanap";
            }}
          >
            Contact
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toast("Hold on", {
                description: "More Features will be comming soon",
              })
            }
          >
            Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                {userData?.login || "User Name"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    toast("Hold on", {
                      description: "More Features will be comming soon",
                    })
                  }
                >
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    onClick={() =>
                      toast("Hold on", {
                        description: "More Features will be comming soon",
                      })
                    }
                  >
                    Invite users
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={(event) => event.preventDefault()}>
                  Theme
                  <DropdownMenuShortcut>
                    <div className="border border-gray-400 rounded-full p-1 px-2 flex space-x-3">
                      <Button className="h-4 w-4" variant="ghost" size="icon">
                        <LaptopIcon
                          onClick={() => setTheme("system")}
                          className="h-[1.6rem] w-[1.6rem] "
                        />
                      </Button>
                      <Button className="h-4 w-4" variant="ghost" size="icon">
                        <SunIcon
                          onClick={() => setTheme("light")}
                          className="h-[1.6rem] w-[1.6rem] "
                        />
                      </Button>
                      <Button className="h-4 w-4" variant="ghost" size="icon">
                        <MoonIcon
                          onClick={() => setTheme("dark")}
                          className="h-[1.6rem] w-[1.6rem]"
                        />
                      </Button>
                    </div>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleAuth}>
                {isLoggedIn ? <p>Log Out</p> : <p>Log In</p>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(event) => event.preventDefault()}>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() =>
                    toast("Hold on", {
                      description: "More Features will be comming soon",
                    })
                  }
                >
                  Upgrade to Pro
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}

export default Navbar;
