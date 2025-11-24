"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

const headingFont = localFont({
    src:"../public/fonts/font.woff2",
})

interface LogoProps {
    href?: string;
}

export const Logo = ({ href = "/" }: LogoProps) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(href);
    };

    const content = (
        <div className="hover:opacity-75 transition-opacity duration-150 items-center gap-x-2 hidden md:flex cursor-pointer">
            <Image 
                src="/logo.svg"
                alt="Logo"
                height={30}
                width={30}
                priority
            />
            <p className={cn(
                "text-lg text-neutral-700 pt-1",
                headingFont.className,
            )}>
                Epitrello
            </p>
        </div>
    );

    return href ? (
        <div onClick={handleClick}>
            {content}
        </div>
    ) : content;
}
