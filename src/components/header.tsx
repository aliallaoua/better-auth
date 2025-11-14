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
							>
								<Logo />
							</Link>

							<button
								type="button"
								onClick={() => setMenuState(!menuState)}
								aria-label={menuState ? "Close Menu" : "Open Menu"}
								className="-m-2.5 -mr-4 relative z-20 block cursor-pointer p-2.5 lg:hidden"
							>
								<Menu className="m-auto size-6 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 duration-200" />
								<X className="-rotate-180 absolute inset-0 m-auto size-6 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 scale-0 in-data-[state=active]:opacity-100 opacity-0 duration-200" />
							</button>

							<div className="hidden lg:flex lg:items-center lg:gap-12">
								<NavigationMenu viewport={false}>
									<NavigationMenuList>
										<NavigationMenuItem>
											<NavigationMenuTrigger className="text-muted-foreground duration-150 hover:text-accent-foreground">
												Home
											</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
													<li className="row-span-3">
														<NavigationMenuLink asChild>
															<Link
																className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-hidden focus:shadow-md"
																to="/"
															>
																<div className="mt-4 mb-2 font-medium text-lg">
																	shadcn/ui
																</div>
																<p className="text-muted-foreground text-sm leading-tight">
																	Beautifully designed components built with
																	Tailwind CSS.
																</p>
															</Link>
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
											<NavigationMenuTrigger className="text-muted-foreground duration-150 hover:text-accent-foreground">
												Components
											</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
										<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
												fill="currentColor"
											/>
										</svg>
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
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link to={href}>
					<div className="font-medium text-sm leading-none">{title}</div>
					<p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
