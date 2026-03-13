export const getAvatarInitial = (name?: string | null, email?: string): string => {
	if (name && name.length > 0) return name.charAt(0).toUpperCase();
	if (email && email.length > 0) return email.charAt(0).toUpperCase();
	return "?";
};
