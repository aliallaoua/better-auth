import { Image } from "@unpic/react";

export default function ContentSection() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
				<h2 className="mb-2 bg-linear-to-br from-black to-gray-300/80 bg-clip-text text-center text-5xl text-transparent leading-[120%] tracking-tighter md:text-6xl dark:from-white dark:to-[#ffffff80]">
					The ecosystem that powers your full-stack TypeScript apps
				</h2>
				<div className="grid gap-6 pt-10 sm:grid-cols-2 md:gap-12 lg:gap-24">
					<div className="relative mb-6 sm:mb-0">
						<div className="relative aspect-76/59 rounded-2xl bg-linear-to-b from-zinc-300 to-transparent p-px dark:from-zinc-700">
							<Image
								src="/app-admin-dark.png"
								className="hidden rounded-[15px] dark:block"
								alt="payments illustration dark"
								width={1207}
								height={929}
							/>
							<Image
								src="/app-admin-light.png"
								className="rounded-[15px] shadow dark:hidden"
								alt="payments illustration light"
								width={1207}
								height={929}
							/>
						</div>
					</div>

					<div className="relative space-y-4">
						<p className="text-muted-foreground">
							TanStack Start brings full-document SSR, streaming, and server
							functions. Better Auth adds secure authentication. Drizzle and
							Neon give you reliable, scalable data handling.
						</p>
						<p className="text-muted-foreground">
							Combined with TailwindCSS, Shadcn, and Ultracite, this stack gives
							you unmatched control, performance, and type safety.
						</p>

						<div className="pt-6">
							<blockquote className="border-l-4 pl-4">
								<p>
									Building with this stack feels effortless — every piece fits
									perfectly. From backend to frontend, everything just works.
								</p>

								<div className="mt-6 space-y-3">
									<cite className="block font-medium">
										Ali Allaoua, Developer
									</cite>
									<Image
										className="h-5 w-fit dark:invert"
										src="https://html.tailus.io/blocks/customers/nvidia.svg"
										alt="Nvidia Logo"
										height={20}
										width={20}
									/>
								</div>
							</blockquote>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
