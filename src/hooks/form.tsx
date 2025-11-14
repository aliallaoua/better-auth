import { createFormHook } from "@tanstack/react-form-start";
// import { lazy } from 'react';
import { CheckboxField } from "@/components/checkbox-field";
import DateField from "@/components/date-field";
import ImageField from "@/components/image-field";
import PasswordField from "@/components/password-field";
import { SelectField } from "@/components/select-field";
import SubscribeButton from "@/components/subscribe-button";
import TextField from "@/components/text-field";
import { fieldContext, formContext } from "./form-context";

// const TextField = lazy(() => import('@/components/TextField'));
// const ImageField = lazy(() => import('@/components/ImageField'));
// const PasswordField = lazy(() => import('@/components/PasswordField'));
// const DateField = lazy(() => import('@/components/DateField'));

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
