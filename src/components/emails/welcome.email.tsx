import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface WelcomeEmailProps {
	username?: string;
}

const WelcomeEmail = ({ username }: WelcomeEmailProps) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>Welcome to our community! Let's get you started.</Preview>
				<Body className="bg-gray-100 py-10 font-family-sans">
					<Container className="mx-auto max-w-xl rounded-lg bg-white p-8">
						{/* Header */}
						<Section className="mb-8 text-center">
							<Heading className="m-0 mb-4 font-bold text-3xl text-gray-900">
								Welcome to Our Community!
							</Heading>
							<Text className="m-0 text-base text-gray-600">
								Hi {username}, we're thrilled to have you on board
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="mb-8">
							<Text className="mb-4 text-base text-gray-700 leading-6">
								Thank you for joining us! You're now part of an amazing
								community where you can discover new opportunities, connect with
								like-minded people, and achieve your goals.
							</Text>

							<Text className="mb-6 text-base text-gray-700 leading-6">
								Here's what you can do next:
							</Text>

							{/* Action Items */}
							<Section className="mb-6">
								<Text className="mb-2 font-semibold text-gray-700 text-sm">
									✓ Complete your profile
								</Text>
								<Text className="mb-4 ml-5 text-gray-600 text-sm">
									Add your information to help others connect with you
								</Text>

								<Text className="mb-2 font-semibold text-gray-700 text-sm">
									✓ Explore our features
								</Text>
								<Text className="mb-4 ml-5 text-gray-600 text-sm">
									Discover all the tools and resources available to you
								</Text>

								<Text className="mb-2 font-semibold text-gray-700 text-sm">
									✓ Join the conversation
								</Text>
								<Text className="mb-4 ml-5 text-gray-600 text-sm">
									Connect with other members and start building relationships
								</Text>
							</Section>

							{/* CTA Button */}
							<Section className="mb-8 text-center">
								<Button
									href="https://example.com/get-started"
									className="box-border rounded-lg bg-blue-600 px-8 py-4 font-semibold text-base text-white no-underline"
								>
									Get Started Now
								</Button>
							</Section>

							<Text className="mb-4 text-base text-gray-700 leading-6">
								If you have any questions or need help getting started, don't
								hesitate to reach out to our support team. We're here to help
								you succeed!
							</Text>
						</Section>

						<Hr className="my-8 border-gray-200" />

						{/* Footer */}
						<Section>
							<Text className="mb-4 text-center text-gray-500 text-sm">
								Thanks for choosing us,
								<br />
								The Team
							</Text>

							<Text className="m-0 mb-2 text-center text-gray-400 text-xs">
								123 Business Street, Suite 100
								<br />
								City, State 12345
							</Text>

							<Text className="m-0 text-center text-gray-400 text-xs">
								<Link
									href="https://example.com/unsubscribe"
									className="text-gray-400 underline"
								>
									Unsubscribe
								</Link>
								{" • "}© 2025 Company Name. All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

WelcomeEmail.PreviewProps = {
	username: "Ali",
};

export default WelcomeEmail;
