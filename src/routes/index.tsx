import { createFileRoute } from "@tanstack/react-router";
import CallToAction from "@/components/call-to-action";
import ContentSection from "@/components/content";
import Features from "@/components/features";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<main>
			<HeroSection />
			<Features />
			<ContentSection />
			<CallToAction />
			<FooterSection />
		</main>
	);
}
