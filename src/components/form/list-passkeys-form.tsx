import type { ErrorContext } from "better-auth/react";
import { Fingerprint, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { AddPasskeyForm } from "./add-passkey-form";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export function ListPasskeysForm() {
	const { data } = authClient.useListPasskeys();
	const [isOpen, setIsOpen] = useState(false);
	const [deletingPasskeyIds, setDeletingPasskeyIds] = useState<Set<string>>(new Set());

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger
				render={
					<Button
						className="cursor-pointer text-xs md:text-sm"
						variant="outline"
					>
						<Fingerprint className="mr-2 size-4" />
						<span>Passkeys {data?.length ? `[${data?.length}]` : ""}</span>
					</Button>
				}
			/>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Passkeys</DialogTitle>
					<DialogDescription>List of passkeys</DialogDescription>
				</DialogHeader>
				{data?.length ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((passkey) => {
								const isDeleting = deletingPasskeyIds.has(passkey.id);
								return (
									<TableRow
										key={passkey.id}
										className="flex items-center justify-between"
									>
										<TableCell>{passkey.name || "My Passkey"}</TableCell>
										<TableCell className="text-right">
											<Button
												className="cursor-pointer"
												onClick={async () => {
													await authClient.passkey.deletePasskey({
														id: passkey.id,
														fetchOptions: {
															onRequest: () => {
																setDeletingPasskeyIds((prev) => new Set(prev).add(passkey.id));
															},
															onSuccess: () => {
																toast("Passkey deleted successfully");
																setDeletingPasskeyIds((prev) => {
																	const next = new Set(prev);
																	next.delete(passkey.id);
																	return next;
																});
															},
															onError: (error: ErrorContext) => {
																toast.error(error.error.message);
																setDeletingPasskeyIds((prev) => {
																	const next = new Set(prev);
																	next.delete(passkey.id);
																	return next;
																});
															},
														},
													});
												}}
											>
												{isDeleting ? (
													<Spinner />
												) : (
													<Trash
														className="cursor-pointer text-red-600"
														size={15}
													/>
												)}
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<p className="text-muted-foreground text-sm">No passkeys found</p>
				)}
				{!data?.length && <AddPasskeyForm />}
				<DialogFooter>
					<DialogClose
						render={<Button className="cursor-pointer">Cancel</Button>}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
