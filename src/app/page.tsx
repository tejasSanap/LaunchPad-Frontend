import Landing from "@/components/Landing";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex-col ">
      <div>
        <Navbar />
        <Landing />{" "}
      </div>{" "}
    </main>
  );
}
