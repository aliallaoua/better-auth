import { createFormHook } from "@tanstack/react-form";
import { CheckboxField } from "@/components/checkbox-field";
import DateField from "@/components/date-field";
import ImageField from "@/components/image-field";
import PasswordField from "@/components/password-field";
import { SelectField } from "@/components/select-field";
import SubscribeButton from "@/components/subscribe-button";
import TextField from "@/components/text-field";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
		PasswordField,
		CheckboxField,
		ImageField,
		SelectField,
		DateField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});
