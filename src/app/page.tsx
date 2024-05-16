"use client";

import React from "react";

import {Button} from "@/components/ui/button";
import {ModeToggle} from "@/components/ui/mode-toggle";
import {
    LogOut,
    ScanFace,
} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import SettingsDialog from "@/components/ui/settings-dialog";

export default function Home() {
    const router = useRouter();

    const handleLogout = () => {
        // Perform logout here
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Top App Bar */}
            <header
                className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
                <nav className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <ScanFace className="h-10 w-10"/>
                        <span className="text-xl font-semibold pl-2">
              Face authentication project
            </span>
                    </div>
                </nav>
                <div className="flex items-center gap-4">
                    <SettingsDialog/>
                    <ModeToggle/>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-600 hover:bg-red-100"
                    >
                        <LogOut className="h-6 w-6"/>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold mb-2 px-6 text-text">
                        Super secret content accessed. 😎
                    </h2>
                    <div className="flex justify-center py-6">
                        <Image
                            className="rounded-xl"
                            src={"/monke.png"}
                            alt={"Monke picture"}
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}