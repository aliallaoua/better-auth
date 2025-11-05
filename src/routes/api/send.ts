import { createFileRoute } from "@tanstack/react-router";

import { Resend } from "resend";
import WelcomeEmail from "@/components/emails/welcome.email";
// import { serverEnv } from "@/config/env";
import { serverEnv } from "@/config/server-env";

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend(serverEnv.RESEND_API_KEY);

export const Route = createFileRoute("/api/send")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = await request.json();
				try {
					const { data, error } =
						body.emailType === "react"
							? await resend.emails.send({
									from: "onboarding@resend.dev",
									to: [body.email],
									subject: `Hello from Server Route + ${body.emailType}`,
									react: WelcomeEmail({ username: body.name }),
								})
							: await resend.emails.send({
									from: "onboarding@resend.dev",
									to: [body.email],
									subject: `Hello from Server Route + ${body.emailType}`,
									html: `<p>Welcome ${body.name}, please click on this link to verify your email: ${body.url}`,
								});

					if (error) {
						console.log(error);
					}

					console.log(data);

					return Response.json(data);
				} catch (error) {
					console.log(error);
				}
			},
		},
	},
});
