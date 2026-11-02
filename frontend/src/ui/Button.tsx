import type { ButtonHTMLAttributes  } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:blue=700",
    secondary: "block w-fit px-3 py-1 text-base font-medium text-gray-500 hover:text-gray-950",
    danger: "block w-fit px-3 py-1 text-base font-medium text-red-500 hover:text-red-700",
};

export default function Button({ variant = "primary", className = "", type = "button", ...props} : ButtonProps) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
                        disabled:cursor-not-allowed disabled:opacity-50 
                        ${variantClasses[variant]} ${className}`}
                    {...props}
        />
    );
}