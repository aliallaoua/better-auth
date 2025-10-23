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
		<Html dir="ltr" lang="en">
			<Head />
			<Preview>Welcome to our community! Let's get you started.</Preview>
			<Tailwind>
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
						{/* Header */}
						<Section className="mb-[32px] text-center">
							<Heading className="m-0 mb-[16px] font-bold text-[28px] text-gray-900">
								Welcome to Our Community!
							</Heading>
							<Text className="m-0 text-[16px] text-gray-600">
								Hi {username}, we're thrilled to have you on board
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="mb-[32px]">
							<Text className="mb-[16px] text-[16px] text-gray-700 leading-[24px]">
								Thank you for joining us! You're now part of an amazing
								community where you can discover new opportunities, connect with
								like-minded people, and achieve your goals.
							</Text>

							<Text className="mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								Here's what you can do next:
							</Text>

							{/* Action Items */}
							<Section className="mb-[24px]">
								<Text className="mb-[8px] font-semibold text-[14px] text-gray-700">
									✓ Complete your profile
								</Text>
								<Text className="mb-[16px] ml-[20px] text-[14px] text-gray-600">
									Add your information to help others connect with you
								</Text>

								<Text className="mb-[8px] font-semibold text-[14px] text-gray-700">
									✓ Explore our features
								</Text>
								<Text className="mb-[16px] ml-[20px] text-[14px] text-gray-600">
									Discover all the tools and resources available to you
								</Text>

								<Text className="mb-[8px] font-semibold text-[14px] text-gray-700">
									✓ Join the conversation
								</Text>
								<Text className="mb-[16px] ml-[20px] text-[14px] text-gray-600">
									Connect with other members and start building relationships
								</Text>
							</Section>

							{/* CTA Button */}
							<Section className="mb-[32px] text-center">
								<Button
									className="box-border rounded-[8px] bg-blue-600 px-[32px] py-[16px] font-semibold text-[16px] text-white no-underline"
									href="http://localhost:3000"
								>
									Get Started Now
								</Button>
							</Section>

							<Text className="mb-[16px] text-[16px] text-gray-700 leading-[24px]">
								If you have any questions or need help getting started, don't
								hesitate to reach out to our support team. We're here to help
								you succeed!
							</Text>
						</Section>

						<Hr className="my-[32px] border-gray-200" />

						{/* Footer */}
						<Section>
							<Text className="mb-[16px] text-center text-[14px] text-gray-500">
								Thanks for choosing us,
								<br />
								The Team
							</Text>

							<Text className="m-0 mb-[8px] text-center text-[12px] text-gray-400">
								123 Business Street, Suite 100
								<br />
								City, State 12345
							</Text>

							<Text className="m-0 text-center text-[12px] text-gray-400">
								<Link
									className="text-gray-400 underline"
									href="https://example.com/unsubscribe"
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

export default WelcomeEmail;
