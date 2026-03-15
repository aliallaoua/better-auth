import { createFormHook } from "@tanstack/react-form";
import { CheckboxField } from "@/components/CheckboxField";
import DateField from "@/components/DateField";
import ImageField from "@/components/ImageField";
import PasswordField from "@/components/PasswordField";
import { SelectField } from "@/components/SelectField";
import SubscribeButton from "@/components/SubscribeButton";
import TextField from "@/components/TextField";
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
