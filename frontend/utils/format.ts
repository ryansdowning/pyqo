export function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

export interface DRFError {
  type: string;
  errors: Array<{
    code: string;
    detail: string;
    attr: string | null;
  }>;
}

export function drfErrorToString(error: DRFError): string {
  // Start with the error type, using the enum name for higher-level context
  let result = `Error Type: ${error.type}\n`;

  // Loop through each error item in the errors array
  error.errors.forEach((err) => {
    // Add information about the specific attribute, if present
    if (err.attr) {
      result += `Attribute: ${err.attr}\n`;
    }

    // Add the error code and detail for each item
    result += `Code: ${err.code}\nDetail: ${err.detail}\n\n`;
  });

  // Trim any extra newline characters and return the final string
  return result.trim();
}
