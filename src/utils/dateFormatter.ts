/**
 * Formats a date string into a user-friendly format
 * @param dateString - The date string to format (expected format: YYYY-MM-DD)
 * @returns Formatted date string or fallback message
 */
export function formatDate(dateString: string): string {
  if (!dateString || dateString.trim() === "") {
    return "Date not available";
  }

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Format as "January 1, 2024" or similar
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
}

/**
 * Formats a date string into a relative time format (e.g., "2 months ago")
 * @param dateString - The date string to format
 * @returns Relative time string or fallback message
 */
export function formatRelativeDate(dateString: string): string {
  if (!dateString || dateString.trim() === "") {
    return "Date not available";
  }

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInMonths < 1) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    } else if (diffInYears < 1) {
      return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
    } else {
      return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
    }
  } catch (error) {
    return "Invalid date";
  }
}
