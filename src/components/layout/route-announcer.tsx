"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteAnnouncer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    // Determine friendly page name
    let pageName = "Home";
    if (pathname === "/") {
      pageName = "Home";
    } else {
      const parts = pathname.split("/").filter(Boolean);
      if (parts[0]) {
        pageName = parts[0]
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    }

    setAnnouncement(`${pageName} loaded`);

    // Shift focus to h1 or main-content on client-side navigation
    const focusTimer = setTimeout(() => {
      const h1 = document.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      } else {
        const main = document.getElementById("main-content");
        if (main) {
          main.focus({ preventScroll: true });
        }
      }
    }, 150);

    return () => clearTimeout(focusTimer);
  }, [pathname]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcement}
    </div>
  );
}
