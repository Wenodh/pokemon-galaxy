import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
}

export function ErrorMessage({
  message,
  className,
  ...props
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive",
        className
      )}
      role="alert"
      {...props}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
