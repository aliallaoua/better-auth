import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

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
						<Button
							className="h-12 rounded-2xl border-2 px-5 font-semibold hover:bg-primary hover:text-primary-foreground hover:dark:bg-primary hover:dark:text-primary-foreground"
							variant="outline"
							render={
								<Link
									to="/dashboard"
									viewTransition={{ types: ["slide-up"] }}
								/>
							}
						>
							Get Started
							<ChevronRightIcon className="size-3 text-muted-foreground" />
						</Button>
						<Button
							className="h-12 rounded-2xl text-muted-foreground hover:bg-transparent hover:dark:bg-transparent"
							variant="ghost"
							render={
								<Link
									to="/dashboard"
									viewTransition={{ types: ["slide-up"] }}
								/>
							}
						>
							Book demo
							<ChevronRightIcon className="size-3" />
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
