"use client";
import axiosInstance from "@/axiosConfig";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

function page({}: Props) {
  const router = useRouter();
  const { userData } = useAuth();
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !userData?.repos_url) {
          console.error("Missing token or repos_url");
          return;
        }

        const res = await axiosInstance.get("/getGithubRepos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            repos_url: userData.repos_url,
          },
        });

        console.log("res1234444", res.data);
        setRepositories(res.data); // Assuming the backend returns repositories in this format
      } catch (error) {
        console.error("Error fetching repositories", error);
      }
    };

    fetchRepositories();
  }, [userData]);

  const handleImport = (repo) => {
    const queryParams = new URLSearchParams({
      repoName: repo.name,
      owner: repo.owner.login,
      cloneUrl: repo.clone_url,
    }).toString();
    router.push(`/new/import-details?${queryParams}`);
  };

  return (
    <>
      <DashboardNavbar />
      <div className="flex justify-center mt-8">
        <Card className="w-[40%]">
          <CardHeader>
            <CardTitle>Import Repos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">
              {repositories.map((repo, index) => {
                return (
                  <div className="flex border rounded-sm justify-between p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10">
                        <img
                          src={repo.owner.avatar_url}
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <p>{repo?.name}</p>
                    </div>
                    <Button onClick={() => handleImport(repo)}>Import</Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
export default page;
