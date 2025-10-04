import { Users } from 'lucide-react';
import type React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UserManagementCardProps {
	children: React.ReactNode;
	className?: string;
}

export function UserManagementCard({
	children,
	className,
}: UserManagementCardProps) {
	return (
		<Card
			className={cn(
				'col-span-full border-2 transition-all duration-300 hover:shadow-xl',
				'bg-gradient-to-br from-background to-muted/5',
				className
			)}
		>
			<CardHeader className="border-b bg-muted/20 pb-6">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<CardTitle className="flex items-center gap-3 text-2xl">
							<div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
								<Users className="size-5" />
							</div>
							User Management
						</CardTitle>
						<CardDescription className="text-base">
							Manage user accounts, roles, and permissions across your platform
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-6">{children}</CardContent>
			<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
		</Card>
	);
}
