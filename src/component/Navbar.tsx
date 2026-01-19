import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import Link from "next/link";
import { Container } from "@/ui/Container";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";

const Navbar = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
    const { user } = useUser();
    return (
        <nav ref={ref} {...props}
            className={cn("shadow content-center text-sm md:text-base", className)}
        >
            <Container className="flex items-center justify-between py-4 gap-x-12">
                <div className="font-bold shrink-0">
                    <Link href='/'><Button>Book Page</Button></Link>
                </div>
                <div className="flex gap-x-3 min-w-0 items-center">
                    
                    {(() => {
                        if(!user) {
                            return <Link href='/auth/login'><Button>Sign in</Button></Link>;
                        }
                        return (
                            <>
                                <div className="relative aspect-square w-auto h-8 rounded-full overflow-hidden shrink-0">
                                    <Image
                                        src={user.picture??""}
                                        alt="profile image"
                                        fill
                                        sizes="32px"
                                    />
                                </div>
                                <p className="truncate font-semibold">{user.nickname}</p>
                                <Link href={'/auth/logout'} className="shrink-0"><Button>Log out</Button></Link>
                            </>
                        )
                    })()}
                </div>
            </Container>
        </nav>
    )
});

export { Navbar };