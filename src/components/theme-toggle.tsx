import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						className="size-8 cursor-pointer rounded-full"
						size="icon"
						variant="outline"
					>
						<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				}
			/>

			<DropdownMenuContent
				align="end"
				// onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => setTheme("light")}
				>
					<SunIcon />
					Light
				</DropdownMenuItem>

				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => setTheme("dark")}
				>
					<MoonIcon />
					Dark
				</DropdownMenuItem>

				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => setTheme("system")}
				>
					<MonitorIcon />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
