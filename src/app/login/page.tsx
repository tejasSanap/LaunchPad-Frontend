"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import axiosInstance from "@/axiosConfig";
import { useRouter } from "next/navigation";
import React, { useReducer, useState } from "react";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

type Props = {};
const CLIENT_ID = "Ov23ctKNvlAqRN9dh8Pd";
function page({}: Props) {
  const router = useRouter();

  const [rerender, setRerender] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const { logout, isLoggedIn, setIsLoggedIn } = useAuth();
  const [count, setCount] = useState(0);

  const loginWithGithub = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    if (codeParam && !localStorage.getItem("accessToken")) {
      const getAccessToken = async () => {
        const res = await axiosInstance.get(
          "/getAccessToken?code=" + codeParam
        );

        if (res.data.split("=")[0] === "access_token") {
          const token = res.data.split("=")[1].split("&")[0];
          localStorage.setItem("accessToken", token);
          console.log("token", token);
          setIsLoggedIn(true);
          router.push("/");
        }
        console.log("res", res);
      };
      getAccessToken();
    }
  }, []);

  const fetchGithubData = async () => {
    console.log("token");
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setName("plz login first");
      return;
    }
    const res = await axiosInstance.get("/getUserData", {
      headers: {
        Authorization: token,
      },
    });
    console.log("res data", res);
    setName(res.data.login);
  };

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push("/");
  //   }
  // }, []);
  const handleLogout = () => {
    logout();
    setRerender(!rerender);
    console.log("here");
    setCount(count + 1);
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col justify-center items-center mt-8">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Login </TabsTrigger>
            <TabsTrigger disabled value="password">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Please Continue With Github, local auth rolling soon...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@peduarte" />
                </div> */}
                <Button className="w-full gap-2" onClick={loginWithGithub}>
                  <GitHubLogoIcon />
                  Continue with github
                </Button>
              </CardContent>
              <CardFooter>{/* <Button>Save changes</Button> */}</CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* <Button variant="ghost" onClick={fetchGithubData}>
          fetch data
        </Button> */}
        {/* <div>{name && <span>{name}</span>}</div> */}
      </div>
    </>
  );
}

export default page;
