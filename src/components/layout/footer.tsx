export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row sm:px-6 lg:px-8">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with precision. Pokemon Galaxy &copy; {new Date().getFullYear()}.
          Inspired by Linear and Vercel.
        </p>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms
          </a>
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-primary"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
