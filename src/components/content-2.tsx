import { Image } from "@unpic/react";
import { LockKeyholeIcon, MailIcon, User2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
	{
		id: "account",
		label: "Account",
		icon: User2Icon,
		lightImage: "/profile-light.png",
		darkImage: "/profile-dark.png",
		alt: "Account management",
	},
	{
		id: "admin",
		label: "Admin",
		icon: LockKeyholeIcon,
		lightImage: "/admin-light.png",
		darkImage: "/admin-dark.png",
		alt: "Security authentication",
	},
	{
		id: "email",
		label: "Email",
		icon: MailIcon,
		lightImage: "/email-light.png",
		darkImage: "/email-dark.png",
		alt: "Email management",
	},
];

export default function ContentTwoSection() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
				<h2 className="mb-2 bg-linear-to-br from-black to-gray-300/80 bg-clip-text text-center text-5xl text-transparent leading-[120%] tracking-tighter md:text-6xl dark:from-white dark:to-[#ffffff80]">
					Full-stack clarity from start to finish
				</h2>
				<p className="text-center text-muted-foreground">
					Built with TanStack, Better Auth, Drizzle, and Neon — everything you
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
										className="group relative flex-1 justify-start overflow-hidden rounded-2xl border border-slate-200 p-6 md:h-16 dark:border-slate-800"
										value={tab.id}
									>
										<div className="hidden rounded-xl group-data-[state='active']:block">
											<BorderBeam
												duration={4}
												// initialOffset={20}
												size={100}
												className="from-transparent via-green-400 to-transparent"
												transition={{
													type: "spring",
													stiffness: 60,
													damping: 20,
												}}
											/>
										</div>
										<div className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-background dark:border-slate-800">
											<Icon className="size-5 transition-transform duration-600 ease-in-out group-hover:rotate-360 group-hover:scale-110 group-data-[state='active']:text-green-400" />
										</div>
										{tab.label}
									</TabsTrigger>
								);
							})}
						</TabsList>

						{tabs.map((tab) => (
							<TabsContent key={tab.id} value={tab.id}>
								<div className="relative w-full overflow-hidden rounded-2xl bg-background">
									<AnimatePresence mode="wait">
										<motion.div
											key={`${tab.id}-images`}
											initial={{ opacity: 0, y: 6, scale: 0.98 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 6, scale: 0.98 }}
											transition={{ duration: 0.2 }}
											className="relative size-full"
										>
											<Image
												src={tab.darkImage}
												className="hidden w-full rounded-2xl border border-slate-800 bg-background object-cover object-top-left dark:block dark:mix-blend-lighten"
												alt={tab.alt}
												width={1232}
												height={657}
											/>
											<Image
												src={tab.lightImage}
												className="w-full rounded-2xl border border-border/25 object-cover dark:hidden"
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
