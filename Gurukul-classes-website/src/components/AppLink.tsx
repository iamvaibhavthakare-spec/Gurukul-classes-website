import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ActiveOptions = {
  exact?: boolean;
};

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  activeOptions?: ActiveOptions;
  activeProps?: {
    className?: string;
  };
  children: ReactNode;
};

export function navigate(to: string) {
  if (window.location.pathname + window.location.hash === to) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new Event("app:navigate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function AppLink({
  to,
  activeOptions,
  activeProps,
  className,
  onClick,
  children,
  ...props
}: AppLinkProps) {
  const pathname = typeof window === "undefined" ? "" : window.location.pathname;
  const active = activeOptions?.exact
    ? pathname === to
    : pathname === to || pathname.startsWith(`${to}/`);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      props.target
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      className={cn(className, active && activeProps?.className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
