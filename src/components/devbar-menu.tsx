import { Laptop, Menu, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "./theme-provider";

const DevbarMenu = () => {
	const { setTheme, appTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button size="icon" variant="outline">
						<Menu className="h-[1.2rem] w-[1.2rem]" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end">
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						{appTheme === "light" ? (
							<Sun className="mr-2 size-4" />
						) : (
							<Moon className="mr-2 size-4" />
						)}
						<span>Theme</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setTheme("light")}>
								<Sun className="mr-2 size-4" />
								Light
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>
								<Moon className="mr-2 size-4" />
								Dark
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("system")}>
								<Laptop className="mr-2 size-4" />
								System
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default DevbarMenu;
