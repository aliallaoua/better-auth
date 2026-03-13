import { Shield, UserCheck, Users, UserX } from "lucide-react";
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
		title: "Total",
		icon: Users,
		color: "text-blue-600 dark:text-blue-400",
		bg: "bg-blue-500/10",
	},
	{
		key: "admins",
		title: "Admins",
		icon: Shield,
		color: "text-purple-600 dark:text-purple-400",
		bg: "bg-purple-500/10",
	},
	{
		key: "active",
		title: "Active",
		icon: UserCheck,
		color: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-500/10",
	},
	{
		key: "banned",
		title: "Banned",
		icon: UserX,
		color: "text-red-600 dark:text-red-400",
		bg: "bg-red-500/10",
	},
] as const;

export function StatCard({ userStats, className }: StatCardProps) {
	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-3 lg:grid-cols-4",
				className,
			)}
		>
			{STAT_CONFIG.map((config) => {
				const Icon = config.icon;
				const value = userStats[config.key as keyof UserStats];

				return (
					<div
						key={config.key}
						className="flex items-center gap-3 rounded-lg border bg-card p-4"
					>
						<div
							className={cn(
								"flex size-9 shrink-0 items-center justify-center rounded-lg",
								config.bg,
							)}
						>
							<Icon className={cn("size-4", config.color)} />
						</div>
						<div className="min-w-0">
							<p className="font-mono font-semibold text-xl tabular-nums leading-none">
								{value.toLocaleString()}
							</p>
							<p className="mt-1 text-muted-foreground text-xs">
								{config.title}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
