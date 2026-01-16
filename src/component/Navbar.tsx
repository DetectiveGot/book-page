import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import Link from "next/link";
import { Container } from "@/ui/Container";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";

const Navbar = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
    const { user, isLoading } = useUser();
    console.log(user);
    return (
        <nav ref={ref} {...props}
            className={cn("shadow content-center", className)}
        >
            <Container className="flex items-center justify-between py-4">
                <div className="font-bold text-lg">
                    <Link href='/'><Button>Book Page</Button></Link>
                </div>
                <div className="flex gap-x-3 min-w-0 max-w-xl">
                    
                    {(() => {
                        if(!user) {
                            return <Link href='/auth/login'><Button>Sign in</Button></Link>;
                        }
                        return (
                            <>
                                <div className="relative aspect-square w-auto h-8 rounded-full overflow-hidden">
                                    <Image
                                        src={user.picture??""}
                                        alt="profile image"
                                        fill
                                        sizes="32px"
                                    />
                                </div>
                                <p className="truncate font-semibold">{user.nickname}</p>
                                <Link href={'/auth/logout'}><Button>Log out</Button></Link>
                            </>
                        )
                    })()}
                </div>
            </Container>
        </nav>
    )
});

export { Navbar };