import { Eye, Filter, Users } from 'lucide-react';
import type React from 'react';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface UserManagementCardProps {
	totalUsers: number;
	filteredUsers: number;
	selectedUsers: number;
	children: React.ReactNode;
}

export function UserManagementCard({
	totalUsers,
	filteredUsers,
	selectedUsers,
	children,
}: UserManagementCardProps) {
	return (
		<Card className="col-span-full">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							User Management
						</CardTitle>
						<CardDescription>
							Manage user accounts, roles, and permissions
						</CardDescription>
					</div>
					<div className="flex items-center space-x-2">
						<Badge className="flex items-center gap-1" variant="secondary">
							<Eye className="h-3 w-3" />
							{filteredUsers} of {totalUsers}
						</Badge>
						{selectedUsers > 0 && (
							<Badge className="flex items-center gap-1" variant="default">
								<Filter className="h-3 w-3" />
								{selectedUsers} selected
							</Badge>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">{children}</CardContent>
		</Card>
	);
}
