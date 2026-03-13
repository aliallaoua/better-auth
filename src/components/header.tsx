import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useScroll } from "motion/react";
import React from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { routerConfig } from "@/utils/viewTransitionOptions";
import { GitHubIcon } from "./github-icon";
import { ThemeToggle } from "./theme-toggle";
import UserButton from "./user-button";

const menuItems = [
	{ name: "Better Auth", href: "/dashboard" },
	{ name: "Posts", href: "/posts" },
];

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

export const HeroHeader = () => {
	const [menuState, setMenuState] = React.useState(false);
	const [scrolled, setScrolled] = React.useState(false);

	const { scrollYProgress } = useScroll();

	React.useEffect(() => {
		const unsubscribe = scrollYProgress.on("change", (latest) => {
			setScrolled(latest > 0.05);
		});
		return () => unsubscribe();
	}, [scrollYProgress]);

	return (
		<header>
			<nav
				data-state={menuState && "active"}
				className={cn(
					"fixed z-20 w-full border-b transition-colors duration-150",
					scrolled && "bg-background/50 backdrop-blur-3xl"
				)}
			>
				<div className="mx-auto max-w-5xl px-6 transition-all duration-300">
					<div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
						<div className="flex w-full items-center justify-between gap-12 lg:w-auto">
							<Link
								to="/"
								aria-label="home"
								className="flex items-center space-x-2"
								viewTransition={{ types: ["slide-right"] }}
							>
								<Logo />
							</Link>

							<button
								type="button"
								onClick={() => setMenuState(!menuState)}
								aria-label={menuState ? "Close Menu" : "Open Menu"}
								className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
							>
								<Menu className="m-auto size-6 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 duration-200" />
								<X className="absolute inset-0 m-auto size-6 -rotate-180 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 scale-0 in-data-[state=active]:opacity-100 opacity-0 duration-200" />
							</button>

							<div className="hidden lg:flex lg:items-center lg:gap-12">
								<NavigationMenu>
									<NavigationMenuList>
										<NavigationMenuItem>
											<NavigationMenuTrigger>Home</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
													<li className="row-span-3">
														<NavigationMenuLink
															render={
																<Link
																	to="/"
																	className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
																	viewTransition={{ types: ["slide-right"] }}
																/>
															}
														>
															<div className="mt-4 mb-2 font-medium text-lg">
																shadcn/ui
															</div>
															<p className="text-muted-foreground text-sm leading-tight">
																Beautifully designed components built with
																Tailwind CSS.
															</p>
														</NavigationMenuLink>
													</li>
													<ListItem href="/docs" title="Introduction">
														Re-usable components built using Radix UI and
														Tailwind CSS.
													</ListItem>
													<ListItem
														href="/docs/installation"
														title="Installation"
													>
														How to install dependencies and structure your app.
													</ListItem>
													<ListItem
														href="/docs/primitives/typography"
														title="Typography"
													>
														Styles for headings, paragraphs, lists...etc
													</ListItem>
												</ul>
											</NavigationMenuContent>
										</NavigationMenuItem>

										<NavigationMenuItem>
											<NavigationMenuTrigger>Components</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
													{components.map((component) => (
														<ListItem
															key={component.title}
															title={component.title}
															href={component.href}
														>
															{component.description}
														</ListItem>
													))}
												</ul>
											</NavigationMenuContent>
										</NavigationMenuItem>
									</NavigationMenuList>
								</NavigationMenu>

								<ul className="flex gap-8 text-sm">
									{menuItems.map((item, index) => (
										<li key={index}>
											<Link
												to={item.href}
												className="block text-muted-foreground duration-150 hover:text-accent-foreground"
												viewTransition={{
													types: routerConfig.viewTransitionOptions,
												}}
											>
												<span>{item.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="mb-6 in-data-[state=active]:block hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:in-data-[state=active]:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
							<div className="lg:hidden">
								<ul className="space-y-6 text-base">
									{menuItems.map((item, index) => (
										<li key={index}>
											<Link
												to={item.href}
												className="block text-muted-foreground duration-150 hover:text-accent-foreground"
												viewTransition={{
													types: routerConfig.viewTransitionOptions,
												}}
											>
												<span>{item.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="flex w-full flex-row gap-3 md:w-fit">
								<a
									href="https://github.com/aliallaoua/"
									rel="noreferrer"
									target="_blank"
								>
									<Button
										className="size-8 cursor-pointer rounded-full"
										size="icon"
										variant="outline"
									>
										<GitHubIcon />
									</Button>
								</a>

								<ThemeToggle />
								<UserButton />
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

function ListItem({
	title,
	children,
	href,
}: {
	title: string;
	children: React.ReactNode;
	href: string;
}) {
	return (
		<li>
			<NavigationMenuLink
				render={
					<Link
						to={href}
						className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
						viewTransition={{ types: routerConfig.viewTransitionOptions }}
					/>
				}
			>
				<div className="font-medium text-sm leading-none">{title}</div>
				<p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
					{children}
				</p>
			</NavigationMenuLink>
		</li>
	);
}
