import { Link } from "@tanstack/react-router";

export default function CallToAction() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl px-6">
				<div className="text-center">
					{/* <h2 className="text-balance text-4xl font-semibold lg:text-5xl"> */}
					<h2 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center font-semibold text-6xl text-transparent leading-none dark:from-white dark:to-slate-900/10">
						Build with the full-stack TypeScript ecosystem
					</h2>
					<p className="mt-4">
						Start your next project using TanStack Start, Better Auth, Drizzle
						ORM, Neon, and Shadcn UI — fully type-safe, modern, and
						production-ready.
					</p>

					<div className="mt-12 flex flex-wrap justify-center gap-4">
						{/* <Button asChild size="lg">
							<Link to="/dashboard">
								<span>Get Started</span>
							</Link>
						</Button>

						<Button asChild size="lg" variant="outline">
							<Link to="/posts">
								<span>Book Demo</span>
							</Link>
						</Button> */}
						<Link
							className="relative inline-flex h-12 select-none items-center justify-center gap-0 rounded-2xl border-[2px] border-black/5 bg-[linear-gradient(104deg,rgba(0,0,0,0.03)_5%,rgba(0,0,0,0.06)_100%)] bg-origin-border px-5 font-semibold text-base text-black shadow-sm backdrop-blur-[25px] transition-all duration-200 ease-in-out after:pointer-events-none after:absolute after:top-[-2px] after:left-[-2px] after:h-[calc(100%+4px)] after:w-[calc(100%+4px)] after:rounded-[1rem] after:bg-[url(&quot;/static/texture-btn.png&quot;)] after:bg-repeat not-disabled:hover:bg-black/90 not-disabled:hover:text-white not-disabled:hover:shadow-button focus-visible:bg-black/90 focus-visible:text-white focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:text-black/50 disabled:opacity-30 dark:border-white/5 dark:bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] dark:text-white dark:disabled:text-white/50 dark:focus-visible:bg-white/90 dark:focus-visible:text-black dark:focus-visible:ring-white/30 dark:not-disabled:hover:bg-white/90 dark:not-disabled:hover:text-black"
							to="/dashboard"
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
							className="relative inline-flex h-12 select-none items-center justify-center gap-0 rounded-2xl border border-transparent bg-transparent px-5 font-semibold text-base transition duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-70 dark:text-gray-9 dark:focus-visible:ring-gray-a2 dark:hover:text-gray-10 [&amp;_svg]:dark:text-gray-9"
							to="/posts"
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
