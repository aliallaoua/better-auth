import { Users } from 'lucide-react';
import type React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface UserManagementCardProps {
	children: React.ReactNode;
}

export function UserManagementCard({ children }: UserManagementCardProps) {
	return (
		<Card className="col-span-full">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2">
							<Users className="size-5" />
							User Management
						</CardTitle>
						<CardDescription>
							Manage user accounts, roles, and permissions
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">{children}</CardContent>
		</Card>
	);
}
