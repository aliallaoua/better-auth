import { Settings2, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BorderBeam } from "./ui/border-beam";
import { GlowEffect } from "./ui/glow-effect";
import { ShineBorder } from "./ui/shine-border";

export default function Features() {
	return (
		<section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
			<div className="@container mx-auto max-w-5xl px-6">
				<div className="text-center">
					<h2 className="text-balance font-semibold text-4xl lg:text-5xl">
						Built to cover your needs
					</h2>
					<p className="mt-4">
						Libero sapiente aliquam quibusdam aspernatur, praesentium iusto
						repellendus.
					</p>
				</div>
				<div className="mx-auto mt-8 grid @min-4xl:max-w-full max-w-sm @min-4xl:grid-cols-3 gap-6 *:text-center md:mt-16">
					<Card className="group relative bg-background">
						{/* <BorderTrail
							className={
								"bg-linear-to-l from-green-300 via-green-500 to-green-300 transition-opacity duration-300 dark:from-green-700/30 dark:via-green-500 dark:to-green-700/30"
							}
							size={120}
							transition={{
								ease: [0, 0.5, 0.8, 0.5],
								duration: 4,
								repeat: Number.POSITIVE_INFINITY,
							}}
						/> */}
						<CardHeader className="pb-3">
							<CardDecorator>
								<Zap className="size-6" aria-hidden />
							</CardDecorator>

							<h3 className="mt-6 font-medium">Full-Stack Type Safety</h3>
						</CardHeader>

						<CardContent>
							<p className="text-sm">
								End-to-end type safety across TanStack Start, Drizzle ORM, and
								Better Auth ensures reliable, predictable apps.
							</p>
						</CardContent>
						{/* <BorderBeam duration={8} size={100} /> */}
						{/* <BorderBeam
							duration={6}
							size={400}
							className="from-transparent via-red-500 to-transparent"
						/> */}
						<BorderBeam
							size={400}
							initialOffset={20}
							className="from-transparent via-yellow-500 to-transparent"
							transition={{
								type: "spring",
								stiffness: 60,
								damping: 20,
							}}
						/>
						<BorderBeam
							duration={6}
							delay={3}
							size={400}
							borderWidth={2}
							initialOffset={70}
							className="from-transparent via-blue-500 to-transparent"
							transition={{
								type: "spring",
								stiffness: 60,
								damping: 20,
							}}
						/>
					</Card>

					<div className="group relative bg-background">
						{/* Glow Effect Layer */}
						<div className="pointer-events-none absolute inset-0">
							<GlowEffect
								colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
								mode="colorShift"
								blur="medium"
								duration={4}
							/>
						</div>

						<Card className="group relative h-full bg-background">
							<CardHeader className="pb-3">
								<CardDecorator>
									<Settings2 className="h-6 w-6" aria-hidden />
								</CardDecorator>

								<h3 className="mt-6 font-medium">Universal Deployment</h3>
							</CardHeader>

							<CardContent>
								<p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
									Deploy seamlessly on any Vite-compatible provider. Neon's
									serverless Postgres adapts automatically.
								</p>
							</CardContent>
						</Card>
					</div>

					<Card className="group relative bg-background">
						<ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
						<CardHeader className="pb-3">
							<CardDecorator>
								<Sparkles className="size-6" aria-hidden />
							</CardDecorator>

							<h3 className="mt-6 font-medium">AI-Optimized Dev Experience</h3>
						</CardHeader>

						<CardContent>
							<p className="mt-3 text-sm">
								Ultracite and Biome keep your codebase consistent and AI-ready
								for future development workflows.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
	<div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
		<div
			aria-hidden
			className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
		/>

		<div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-background">
			{children}
		</div>
	</div>
);
