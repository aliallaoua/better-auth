import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function CallToAction() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl px-6">
				<div className="text-center">
					{/* <h2 className="text-balance text-4xl font-semibold lg:text-5xl"> */}
					<h2 className="effect mb-4 bg-linear-to-br from-black to-gray-300/80 bg-clip-text pb-3 font-domaine text-[4rem] text-shadow-lg text-transparent leading-[100%] tracking-[-0.01em] md:text-[4.8rem] dark:from-white dark:to-[#ffffff80]">
						Build with the full-stack TypeScript ecosystem
					</h2>
					<p className="mb-24 text-balance text-center font-normal text-base text-muted-foreground md:text-xl md:leading-normal">
						Start your next project using TanStack Start, Better Auth, Drizzle
						ORM, Neon, and Shadcn UI — fully type-safe, modern, and
						production-ready.
					</p>

					<div className="mt-12 flex flex-wrap justify-center gap-4">
						<Link
							to="/dashboard"
							viewTransition={{ types: ["slide-up"] }}
							className={cn(
								buttonVariants({ variant: "outline" }),
								"h-12 rounded-2xl border-2 px-5 font-semibold hover:bg-primary hover:text-primary-foreground hover:dark:bg-primary hover:dark:text-primary-foreground",
							)}
						>
							Get Started
							<ChevronRightIcon className="size-3 text-muted-foreground" />
						</Link>
						<Link
							to="/dashboard"
							viewTransition={{ types: ["slide-up"] }}
							className={cn(
								buttonVariants({ variant: "ghost" }),
								"h-12 rounded-2xl text-muted-foreground hover:bg-transparent hover:dark:bg-transparent",
							)}
						>
							Book demo
							<ChevronRightIcon className="size-3" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
