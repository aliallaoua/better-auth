import { Shield, TrendingUp, UserCheck, Users, UserX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
			trend: '+12%',
			trendLabel: 'from last month',
			isPositive: true,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50 dark:bg-blue-950/30',
			borderColor: 'border-blue-200 dark:border-blue-900',
		},
		{
			title: 'Administrators',
			value: userStats.admins,
			icon: Shield,
			description: 'Admin role users',
			trend: '0%',
			trendLabel: 'No change',
			isPositive: null,
			color: 'text-purple-600',
			bgColor: 'bg-purple-50 dark:bg-purple-950/30',
			borderColor: 'border-purple-200 dark:border-purple-900',
		},
		{
			title: 'Active Users',
			value: userStats.active,
			icon: UserCheck,
			description: 'Currently active',
			trend: '+8%',
			trendLabel: 'from last month',
			isPositive: true,
			color: 'text-green-600',
			bgColor: 'bg-green-50 dark:bg-green-950/30',
			borderColor: 'border-green-200 dark:border-green-900',
		},
		{
			title: 'Banned Users',
			value: userStats.banned,
			icon: UserX,
			description: 'Suspended accounts',
			trend: '-2%',
			trendLabel: 'from last month',
			isPositive: false,
			color: 'text-red-600',
			bgColor: 'bg-red-50 dark:bg-red-950/30',
			borderColor: 'border-red-200 dark:border-red-900',
		},
	];

	return (
		<div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<Card
						className={cn(
							'group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-stat-card/25',
							stat.borderColor
						)}
						key={stat.title}
					>
						<CardContent className="p-6">
							<div className="flex items-start justify-between">
								<div className="space-y-3 flex-1">
									<p className="text-sm font-medium text-muted-foreground">
										{stat.title}
									</p>
									<div className="space-y-1">
										<p className="text-3xl font-bold tracking-tight">
											{stat.value.toLocaleString()}
										</p>
										<p className="text-xs text-muted-foreground">
											{stat.description}
										</p>
									</div>
									<div className="flex items-center gap-1 text-xs">
										{stat.isPositive !== null && (
											<TrendingUp
												className={cn(
													'h-3 w-3',
													stat.isPositive ? 'text-green-600' : 'text-red-600',
													!stat.isPositive && 'rotate-180'
												)}
											/>
										)}
										<span
											className={cn(
												'font-medium',
												stat.isPositive === true && 'text-green-600',
												stat.isPositive === false && 'text-red-600',
												stat.isPositive === null && 'text-muted-foreground'
											)}
										>
											{stat.trend}
										</span>
										<span className="text-muted-foreground">
											{stat.trendLabel}
										</span>
									</div>
								</div>
								<div
									className={cn(
										'rounded-xl p-3 transition-transform duration-300 group-hover:scale-110',
										stat.bgColor
									)}
								>
									<Icon className={cn('h-5 w-5', stat.color)} />
								</div>
							</div>
						</CardContent>
						<div
							className={cn(
								'absolute bottom-0 inset-x-0 h-1 transition-all duration-300 group-hover:h-1.5',
								stat.bgColor
							)}
						/>
					</Card>
				);
			})}
		</div>
	);
}
