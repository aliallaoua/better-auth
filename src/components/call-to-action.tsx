import { Link } from "@tanstack/react-router";

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
							className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-black/5 bg-linear-104 from-5% from-black/3 to-100% to-black/6 px-5 font-semibold text-base text-black shadow-sm backdrop-blur-[25px] transition-all duration-200 ease-in-out hover:bg-black/90 hover:text-white hover:shadow-button focus-visible:bg-black/90 focus-visible:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/5 dark:bg-linear-104 dark:from-5% dark:from-white/5 dark:to-100% dark:to-[rgba(240,240,228,0.1)] dark:text-white dark:disabled:opacity-50 dark:focus-visible:bg-white/90 dark:focus-visible:text-black dark:focus-visible:ring-white/30 dark:hover:bg-white/90 dark:hover:text-black"
							to="/dashboard"
							viewTransition={{ types: ["slide-up"] }}
						>
							Get Started
							<span className="-mr-2 opacity-100 dark:text-[#70757E]">
								<svg
									fill="none"
									height="24"
									viewBox="0 0 24 24"
									width="24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10.75 8.75L14.25 12L10.75 15.25"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.5"
									/>
								</svg>
							</span>
						</Link>
						<Link
							className="inline-flex h-12 items-center justify-center rounded-2xl border border-transparent px-5 font-semibold text-base text-muted-foreground transition duration-200 ease-in-out hover:text-primary focus-visible:outline-hidden focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-gray-a2 [&_svg]:dark:text-gray-300"
							to="/posts"
							viewTransition={{ types: ["slide-up"] }}
						>
							Book Demo
							<span className="-mr-2 opacity-100 dark:text-[#70757E]">
								<svg
									fill="none"
									height="24"
									viewBox="0 0 24 24"
									width="24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10.75 8.75L14.25 12L10.75 15.25"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.5"
									/>
								</svg>
							</span>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
