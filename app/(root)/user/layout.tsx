"use client";

import { useSession } from "next-auth/react";
import CloudinaryImage from "@/components/CloudinaryImage";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div lang="en" className="bg-[#eff8fc]"> 
            <section className="relative w-full h-[310px]"> 
                <CloudinaryImage
                    localSrc="/images/14.jpg"
                    fill
                    className="object-cover"
                    alt="layout"
                />

                <div 
                    className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/36 to-black/40" 
                />
            </section>

            <section>
                {children}
            </section>
        </div>
    );
}