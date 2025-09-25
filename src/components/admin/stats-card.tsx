import { Shield, TrendingUp, UserCheck, Users, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UserStats {
	total: number;
	admins: number;
	active: number;
	banned: number;
}

interface StatCardProps {
	userStats: UserStats;
	className?: string;
}

export function StatCard({ userStats, className }: StatCardProps) {
	const stats = [
		{
			title: 'Total Users',
			value: userStats.total,
			icon: Users,
			description: 'All registered users',
			trend: '+12% from last month',
			color: 'text-blue-600',
			bgColor: 'bg-blue-50 dark:bg-blue-950/20',
		},
		{
			title: 'Administrators',
			value: userStats.admins,
			icon: Shield,
			description: 'Admin role users',
			trend: 'No change',
			color: 'text-purple-600',
			bgColor: 'bg-purple-50 dark:bg-purple-950/20',
		},
		{
			title: 'Active Users',
			value: userStats.active,
			icon: UserCheck,
			description: 'Currently active',
			trend: '+8% from last month',
			color: 'text-green-600',
			bgColor: 'bg-green-50 dark:bg-green-950/20',
		},
		{
			title: 'Banned Users',
			value: userStats.banned,
			icon: UserX,
			description: 'Suspended accounts',
			trend: '-2% from last month',
			color: 'text-red-600',
			bgColor: 'bg-red-50 dark:bg-red-950/20',
		},
	];

	return (
		<div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<Card
						className="relative overflow-hidden hover:shadow-stat-card/25 h-full w-full transition-all hover:shadow-lg"
						key={stat.title}
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{stat.title}
							</CardTitle>
							<div className={cn('rounded-full p-2', stat.bgColor)}>
								<Icon className={cn('h-4 w-4', stat.color)} />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stat.value.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								{stat.description}
							</p>
							<div className="flex items-center mt-2">
								<TrendingUp className="h-3 w-3 text-green-500 mr-1" />
								<span className="text-xs text-green-600 font-medium">
									{stat.trend}
								</span>
							</div>
						</CardContent>
						<div
							className={cn('absolute inset-x-0 bottom-0 h-1', stat.bgColor)}
						/>
					</Card>
				);
			})}
		</div>
	);
}
