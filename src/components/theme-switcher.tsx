import { motion } from 'framer-motion';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';

const themes = [
	{
		theme: 'system',
		icon: MonitorIcon,
		label: 'System theme',
	},
	{
		theme: 'light',
		icon: SunIcon,
		label: 'Light theme',
	},
	{
		theme: 'dark',
		icon: MoonIcon,
		label: 'Dark theme',
	},
] as const;

interface ThemeSwitcherProps {
	className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
	const { setTheme, appTheme } = useTheme();

	return (
		<div
			className={cn(
				'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
				className
			)}
		>
			{themes.map(({ theme, icon: Icon, label }) => {
				const isActiveTheme = appTheme === theme;

				return (
					<Button
						aria-label={label}
						className="relative size-6 cursor-pointer rounded-full"
						key={theme}
						onClick={() => {
							if (isActiveTheme) return;
							setTheme(theme);
						}}
						type="button"
					>
						{isActiveTheme && (
							<motion.div
								className="absolute inset-0 rounded-full bg-secondary"
								layoutId="activeTheme"
								transition={{ type: 'spring', duration: 0.5 }}
							/>
						)}
						<Icon
							className={cn(
								'relative z-10 m-auto size-4',
								isActiveTheme ? 'text-foreground' : 'text-muted-foreground'
							)}
						/>
					</Button>
				);
			})}
		</div>
	);
}
