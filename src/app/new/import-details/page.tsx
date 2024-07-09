"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { GitHubLogoIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import axiosInstance from "@/axiosConfig";
type Props = {};

interface DeploymentData {
  deploymentId: string;
  deployementDomain?: string;
  subDomain?: string;
}

type LogEntry = {
  timestamp: string;
  log: string;
};

const ImportDetails = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const repoName = searchParams.get("repoName") || "";
  const url = searchParams.get("cloneUrl");

  const [projectName, setProjectName] = useState(repoName);
  const [cloneUrl, SetCloneUrl] = useState(url);
  const [framework, setFramework] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [deploymentId, setDeploymentId] = useState("");

  const [deployementData, setDeployementData] = useState<DeploymentData | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Project Name:", projectName);
    console.log("Clone URL:", cloneUrl);
    console.log("Framework:", framework);

    try {
      let response = await axiosInstance.post("/deploy", {
        name: projectName,
        gitURL: cloneUrl,
        subDomain: subDomain,
      });
      console.log("response", response);
      if (response.status == 200) {
        setLoading(false);
        setDeployed(true);
        setDeployementData(response.data);
        // setDeploymentId(response.data.deploymentId);
      }
    } catch (error) {
      console.error("Deployment error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deployed) {
      const intervalID = setInterval(async () => {
        console.log("first", deployementData);
        try {
          const response = await axiosInstance.get(
            `/logs/${deployementData?.deploymentId}`
          );
          console.log("polling the logs", response);
          let logs = response.data.logs;
          setLogs(logs);
          if (logs[logs.length - 1].log == "Done") {
            clearInterval(intervalID);
          }
        } catch (error) {
          console.error("error fetching logs", error);
        }
      }, 3000);
    }
  }, [deployed]);

  return (
    <>
      <div
        className="flex flex-col"
        style={{
          background: `linear-gradient(to bottom,  ${
            theme == "dark" ? "black" : "white"
          } 35%, ${theme == "dark" ? "#111111" : "#fafafa"} 35%)`,
        }}
      >
        <DashboardNavbar />
        <div className=" flex flex-col w-[60%] self-center item mt-[1%]">
          <div
            className="p-4 cursor-pointer"
            onClick={() => router.push("/new")}
          >
            <p className="text-slate-400 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </p>
            <p className="text-4xl">You're Almost Done</p>
            <p className="text-slate-400">
              Please follow the steps to configure your project and deploy it
            </p>
          </div>

          <div className="flex justify-between p-4">
            <div className="flex w-[25%] border items-center ps-10 gap-2 h-16 rounded-lg color bg-customGray dark:bg-customDarkGray">
              <GitHubLogoIcon className="w-6 h-6" />
              <p>{repoName}</p>
            </div>
            <div className="flex flex-col w-[70%] gap-4">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Configure your project</CardTitle>
                  </CardHeader>
                  <Separator className="my-4" />
                  {!deployed && (
                    <>
                      {" "}
                      <CardContent>
                        <div className="grid w-full items-center gap-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={projectName}
                              onChange={(e) => setProjectName(e.target.value)}
                              placeholder="Project Name"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Sub Domain</Label>
                            <Input
                              id="name"
                              value={subDomain}
                              onChange={(e) => setSubDomain(e.target.value)}
                              placeholder="Sub Domain Name"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="framework">Framework</Label>
                            <Select>
                              <SelectTrigger id="framework">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="next">Next.js</SelectItem>
                                <SelectItem value="sveltekit">
                                  SvelteKit
                                </SelectItem>
                                <SelectItem value="astro">Astro</SelectItem>
                                <SelectItem value="nuxt">Nuxt.js</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          disabled={loading}
                          type="submit"
                          className="w-full"
                        >
                          {loading && (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Deploy
                        </Button>
                      </CardFooter>
                    </>
                  )}
                  {deployed && (
                    <>
                      <CardContent>
                        <div className="border rounded-sm p-2 ">
                          {projectName}
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              </form>
              <Card>
                <CardHeader>
                  <CardTitle>Deploy</CardTitle>
                </CardHeader>
                <Separator className="my-4" />
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full border rounded-sm px-4"
                    disabled={!deployed}
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Build logs</AccordionTrigger>
                      <AccordionContent>
                        {logs.map((log, index) => (
                          <>
                            <div className="flex gap-4">
                              <p>{log?.timestamp.split(" ")[1]}</p>
                              <p>{log?.log}</p>
                            </div>
                          </>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Deployement Summary</AccordionTrigger>
                      <AccordionContent>
                        Yes. It comes with default styles that matches the other
                        components&apos; aesthetic.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Deployement Link</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex items-center gap-4">
                          <Label>Deployement</Label>
                          <a
                            href={`http://${deployementData?.deployementDomain}.localhost:8000`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`http://${deployementData?.deployementDomain}.localhost:8000`}
                          </a>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label>Domains</Label>
                          <a
                            href={`http://${deployementData?.subDomain}.localhost:8000`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`http://${deployementData?.subDomain}.localhost:8000`}
                          </a>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ImportDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImportDetails />
    </Suspense>
  );
}
