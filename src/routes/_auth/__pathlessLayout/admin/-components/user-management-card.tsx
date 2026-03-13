import type React from "react";
import { cn } from "@/lib/utils";

interface UserManagementCardProps {
	children: React.ReactNode;
	className?: string;
}

export function UserManagementCard({
	children,
	className,
}: UserManagementCardProps) {
	return (
		<div className={cn("space-y-0", className)}>
			{children}
		</div>
	);
}
