import { ScriptOnce } from "@tanstack/react-router";
import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { z } from "zod";

const themeModeSchema = z.enum(["light", "dark", "system"]);
const resolvedThemeSchema = z.enum(["light", "dark"]);
const themeKey = "theme";

type ThemeMode = z.infer<typeof themeModeSchema>;
type ResolvedTheme = z.infer<typeof resolvedThemeSchema>;

const getStoredThemeMode = createIsomorphicFn()
	.server((): ThemeMode => "system")
	.client((): ThemeMode => {
		try {
			const storedTheme = localStorage.getItem(themeKey);
			return themeModeSchema.parse(storedTheme);
		} catch {
			return "system";
		}
	});

const setStoredThemeMode = createClientOnlyFn((theme: ThemeMode) => {
	try {
		const parsedTheme = themeModeSchema.parse(theme);
		localStorage.setItem(themeKey, parsedTheme);
	} catch {}
});

const getSystemTheme = createIsomorphicFn()
	.server((): ResolvedTheme => "light")
	.client((): ResolvedTheme => {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	});

const updateThemeClass = createClientOnlyFn((themeMode: ThemeMode) => {
	const root = document.documentElement;
	root.classList.remove("light", "dark", "system");
	const newTheme = themeMode === "system" ? getSystemTheme() : themeMode;
	root.classList.add(newTheme);

	if (themeMode === "system") {
		root.classList.add("system");
	}
});

const setupPreferredListener = createClientOnlyFn(() => {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const handler = () => updateThemeClass("system");
	mediaQuery.addEventListener("change", handler);
	return () => mediaQuery.removeEventListener("change", handler);
});

const getNextTheme = createClientOnlyFn((current: ThemeMode): ThemeMode => {
	const themes: ThemeMode[] =
		getSystemTheme() === "dark"
			? ["system", "light", "dark"]
			: ["system", "dark", "light"];
	return themes[(themes.indexOf(current) + 1) % themes.length];
});

const themeDetectorScript = (() => {
	function themeFn() {
		try {
			const storedTheme = localStorage.getItem("theme") || "system";
			const validTheme = ["light", "dark", "system"].includes(storedTheme)
				? storedTheme
				: "system";

			if (validTheme === "system") {
				const autoTheme = window.matchMedia("(prefers-color-scheme: dark)")
					.matches
					? "dark"
					: "light";
				document.documentElement.classList.add(autoTheme, "system");
			} else {
				document.documentElement.classList.add(validTheme);
			}
		} catch (e) {
			const autoTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			document.documentElement.classList.add(autoTheme, "system");
		}
	}
	return `(${themeFn.toString()})();`;
})();

type ThemeContextProps = {
	themeMode: ThemeMode;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: ThemeMode) => void;
	toggleMode: () => void;
};
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
	children: ReactNode;
};
export function ThemeProvider({ children }: ThemeProviderProps) {
	const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);

	useEffect(() => {
		if (themeMode !== "system") return;
		return setupPreferredListener();
	}, [themeMode]);

	const resolvedTheme = themeMode === "system" ? getSystemTheme() : themeMode;

	const setTheme = (newTheme: ThemeMode) => {
		setThemeMode(newTheme);
		setStoredThemeMode(newTheme);
		updateThemeClass(newTheme);
	};

	const toggleMode = () => {
		setTheme(getNextTheme(themeMode));
	};

	return (
		<ThemeContext.Provider
			value={{ themeMode, resolvedTheme, setTheme, toggleMode }}
		>
			<ScriptOnce children={themeDetectorScript} />
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = use(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
