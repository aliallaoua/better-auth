import { Image } from "@unpic/react";
import { LockKeyholeIcon, MailIcon, User2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
	{
		id: "account",
		label: "Account",
		icon: User2Icon,
		image: "/charts.png",
		alt: "Database visualization",
	},
	{
		id: "password",
		label: "Password",
		icon: LockKeyholeIcon,
		image: "/music.png",
		alt: "Security authentication",
	},
	{
		id: "user",
		label: "User",
		icon: MailIcon,
		image: "/mail2.png",
		alt: "Identity management",
	},
];

export default function ContentTwoSection() {
	const [hoveredTab, setHoveredTab] = useState<string | null>(null);

	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
				<h2 className="mb-2 bg-linear-to-br from-black to-gray-300/80 bg-clip-text text-center text-5xl text-transparent leading-[120%] tracking-tighter md:text-6xl dark:from-white dark:to-[#ffffff80]">
					Full-stack clarity from start to finish
				</h2>
				<p className="text-center text-muted-foreground">
					Built with TanStack, Better Auth, Drizzle, and Neon – everything you
					need to build, authenticate, manage data, and scale reliably. Add
					Resend for seamless email delivery, Tailwind for beautiful design, and
					Biome for polished, AI-ready code. No compromises, no friction.
				</p>

				<div>
					<Tabs defaultValue="account">
						<TabsList className="mb-3 min-h-fit w-full gap-4 bg-background md:mb-8">
							{tabs.map((tab) => {
								const Icon = tab.icon;
								return (
									<TabsTrigger
										key={tab.id}
										className="group relative flex-1 overflow-hidden rounded-2xl border border-slate-200 p-6 md:h-16 dark:border-slate-800"
										value={tab.id}
										onMouseEnter={() => setHoveredTab(tab.id)}
										onMouseLeave={() => setHoveredTab(null)}
									>
										<div className="hidden group-data-[state='active']:block">
											<BorderBeam
												duration={6}
												size={200}
												className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
											/>
										</div>
										<div className="flex size-10 items-center justify-center rounded border border-slate-200 bg-background dark:border-slate-800">
											<motion.div
												animate={
													hoveredTab === tab.id
														? { rotate: 360, scale: 1.1 }
														: { rotate: 0, scale: 1 }
												}
												transition={{ duration: 0.6, ease: "easeInOut" }}
											>
												<Icon className="size-5" />
											</motion.div>
										</div>
										{tab.label}
									</TabsTrigger>
								);
							})}
						</TabsList>

						{tabs.map((tab) => (
							<TabsContent key={tab.id} value={tab.id}>
								<div className="relative aspect-76/59 w-full rounded-2xl bg-background">
									<AnimatePresence mode="wait">
										<motion.div
											key={`${tab.image}-id`}
											initial={{ opacity: 0, y: 6, scale: 0.98 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 6, scale: 0.98 }}
											transition={{ duration: 0.2 }}
											className="size-full overflow-hidden rounded-2xl border border-slate-200 bg-zinc-200 shadow-md dark:border-slate-800 dark:bg-zinc-900"
										>
											<Image
												src={tab.image}
												className="size-full rounded-2xl object-cover object-top-left dark:mix-blend-lighten"
												alt={tab.alt}
												width={1232}
												height={657}
											/>
										</motion.div>
									</AnimatePresence>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</section>
	);
}
