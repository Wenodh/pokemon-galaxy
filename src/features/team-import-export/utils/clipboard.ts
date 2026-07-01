/**
 * Utility to copy text to the clipboard with fallback for older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Async: Could not copy text: ", err);
    return false;
  }
}

/**
 * Utility to read text from the clipboard.
 */
export async function pasteFromClipboard(): Promise<string | null> {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
        return null;
    }

    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        console.error("Async: Could not read text: ", err);
        return null;
    }
}
