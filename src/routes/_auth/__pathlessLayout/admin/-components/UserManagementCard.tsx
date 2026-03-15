import { Users } from "lucide-react";
import type React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UserManagementCardProps {
	children: React.ReactNode;
	className?: string;
	title?: string;
	description?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export function UserManagementCard({
	children,
	className,
	title = "User Management",
	description = "Manage user accounts, roles, and permissions across your platform",
	icon: Icon = Users,
}: UserManagementCardProps) {
	return (
		<Card
			className={cn(
				"relative col-span-full overflow-hidden border-2",
				"bg-linear-to-br from-background to-muted/5",
				"transition-all duration-300 hover:shadow-primary/5 hover:shadow-xl",
				className
			)}
		>
			{/* Gradient Top Border */}
			{/* <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" /> */}

			{/* Header Section */}
			<CardHeader className="border-b bg-linear-to-r from-muted/20 to-muted/10 pb-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-2">
						<CardTitle className="flex items-center gap-3 font-bold text-2xl">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
								<Icon className="size-5" />
							</div>
							{title}
						</CardTitle>
						<CardDescription className="text-muted-foreground text-sm leading-relaxed">
							{description}
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			{/* Content Section */}
			<CardContent className="pt-6">{children}</CardContent>
		</Card>
	);
}
