import { Link } from "@tanstack/react-router";

export default function CallToAction() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl px-6">
				<div className="text-center">
					{/* <h2 className="text-balance text-4xl font-semibold lg:text-5xl"> */}
					<h2 className="pointer-events-none bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10">
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
							className="relative inline-flex items-center justify-center select-none rounded-2xl disabled:cursor-not-allowed ease-in-out text-black dark:text-white border-[2px] border-black/5 dark:border-white/5 backdrop-blur-[25px] bg-origin-border bg-[linear-gradient(104deg,rgba(0,0,0,0.03)_5%,rgba(0,0,0,0.06)_100%)] dark:bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] shadow-sm not-disabled:hover:bg-black/90 dark:not-disabled:hover:bg-white/90 not-disabled:hover:text-white dark:not-disabled:hover:text-black not-disabled:hover:shadow-button transition-all duration-200 disabled:opacity-30 disabled:text-black/50 dark:disabled:text-white/50 focus-visible:ring-4 focus-visible:ring-black/30 dark:focus-visible:ring-white/30 focus-visible:outline-hidden focus-visible:bg-black/90 dark:focus-visible:bg-white/90 focus-visible:text-white dark:focus-visible:text-black after:absolute after:w-[calc(100%+4px)] after:h-[calc(100%+4px)] after:top-[-2px] after:left-[-2px] after:rounded-[1rem] after:bg-[url(&quot;/static/texture-btn.png&quot;)] after:bg-repeat after:pointer-events-none text-base h-12 gap-0 px-5 font-semibold"
							to="/dashboard"
						>
							Get Started
							<span className="dark:text-[#70757E] opacity-100 -mr-2">
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
							className="relative inline-flex items-center border justify-center select-none rounded-2xl disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 bg-transparent border-transparent dark:text-gray-9 [&amp;_svg]:dark:text-gray-9 dark:hover:text-gray-10 focus-visible:ring-4 dark:focus-visible:ring-gray-a2 focus-visible:outline-hidden text-base h-12 gap-0 px-5 font-semibold"
							to="/posts"
						>
							Book Demo
							<span className="dark:text-[#70757E] opacity-100 -mr-2">
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
