import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

const Container = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => (
    <div className={cn(className, "px-10 mx-auto max-w-7xl")} {...props}/>
))

export { Container };