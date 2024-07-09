"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Props = {};

function Landing({}: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const handelDeploying = () => {
    if (isLoggedIn == true) {
      router.push("/new");
    } else {
      router.push("/login");
    }
  };
  return (
    <>
      <div className="flex flex-col border items-center max-w-screen-lg mx-auto mt-20 ">
        <div className="border-b p-10">
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold ">Get Set Launch.</p>
            <p className="text-lg text-center m-[5%]">
              LaunchPad provides developers with cutting-edge tools and robust
              cloud infrastructure to build, scale, and secure web applications
              with unmatched speed and personalization.{" "}
            </p>
            <div>
              <Button onClick={handelDeploying}>Start Deploying</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
