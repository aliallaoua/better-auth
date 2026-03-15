import { Shield, TrendingUp, UserCheck, Users, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const STAT_CONFIG = [
	{
		key: "total",
		title: "Total Users",
		description: "All registered users",
		icon: Users,
		trend: { value: 12, label: "from last month" },
		color: {
			text: "text-blue-600 dark:text-blue-400",
			bg: "bg-blue-50 dark:bg-blue-950/30",
			border: "border-blue-200 dark:border-blue-900",
			accent: "from-blue-400 to-blue-600",
		},
	},
	{
		key: "admins",
		title: "Administrators",
		description: "Admin role users",
		icon: Shield,
		trend: { value: 0, label: "No change" },
		color: {
			text: "text-purple-600 dark:text-purple-400",
			bg: "bg-purple-50 dark:bg-purple-950/30",
			border: "border-purple-200 dark:border-purple-900",
			accent: "from-purple-400 to-purple-600",
		},
	},
	{
		key: "active",
		title: "Active Users",
		description: "Currently active",
		icon: UserCheck,
		trend: { value: 8, label: "from last month" },
		color: {
			text: "text-green-600 dark:text-green-400",
			bg: "bg-green-50 dark:bg-green-950/30",
			border: "border-green-200 dark:border-green-900",
			accent: "from-green-400 to-green-600",
		},
	},
	{
		key: "banned",
		title: "Banned Users",
		description: "Suspended accounts",
		icon: UserX,
		trend: { value: -2, label: "from last month" },
		color: {
			text: "text-red-600 dark:text-red-400",
			bg: "bg-red-50 dark:bg-red-950/30",
			border: "border-red-200 dark:border-red-900",
			accent: "from-red-400 to-red-600",
		},
	},
] as const;

function StatIndicator({ trend }: { trend: number }) {
	if (trend === 0) return null;

	const isPositive = trend > 0;
	return (
		<div className="flex items-center gap-1 text-xs">
			<TrendingUp
				className={cn(
					"size-3 transition-transform",
					isPositive
						? "text-green-600 dark:text-green-400"
						: "rotate-180 text-red-600 dark:text-red-400"
				)}
			/>
			<span
				className={
					isPositive
						? "text-green-600 dark:text-green-400"
						: "text-red-600 dark:text-red-400"
				}
			>
				{isPositive ? "+" : ""}
				{trend}%
			</span>
		</div>
	);
}

export function StatCard({ userStats, className }: StatCardProps) {
	return (
		<div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
			{STAT_CONFIG.map((config) => {
				const Icon = config.icon;
				const value = userStats[config.key as keyof UserStats];

				return (
					<Card
						key={config.key}
						className={cn(
							"group relative overflow-hidden border-2 transition-all duration-300",
							"hover:-translate-y-1 hover:shadow-blue-500/10 hover:shadow-lg",
							config.color.border
						)}
					>
						<CardContent className="p-6">
							<div className="flex items-start justify-between gap-4">
								{/* Content Section */}
								<div className="flex-1 space-y-3">
									<h3 className="font-medium text-muted-foreground text-sm">
										{config.title}
									</h3>

									<div className="space-y-2">
										<p className="font-bold text-3xl tracking-tight">
											{value.toLocaleString()}
										</p>
										<p className="text-muted-foreground text-xs">
											{config.description}
										</p>
									</div>

									{/* <div className="pt-1">
										<StatIndicator trend={config.trend.value} />
										{config.trend.value !== 0 && (
											<p className="text-muted-foreground text-xs">
												{config.trend.label}
											</p>
										)}
									</div> */}
								</div>

								{/* Icon Section */}
								<div
									className={cn(
										"shrink-0 rounded-xl p-3",
										"transition-transform duration-300 group-hover:scale-110",
										config.color.bg
									)}
								>
									<Icon className={cn("size-5", config.color.text)} />
								</div>
							</div>

							{/* Bottom Accent Bar */}
							{/* <div
								className={cn(
									"absolute inset-x-0 bottom-0 h-1",
									"transition-all duration-300 group-hover:h-1.5",
									`bg-linear-to-r ${config.color.accent}`
								)}
							/> */}
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
