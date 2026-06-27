interface PageLayoutProps {
  children: React.ReactNode;
}

/**
 * PageLayout provides a consistent wrapper for page content.
 * Header and Footer are managed by the RootLayout to avoid duplication.
 */
export function PageLayout({ children }: PageLayoutProps) {
  return <>{children}</>;
}
