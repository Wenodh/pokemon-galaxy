import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PageHeader({
  title,
  description,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-1 py-8 md:py-10 lg:py-12", className)}
      {...props}
    >
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground md:text-xl">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
