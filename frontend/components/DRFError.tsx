import { Stack } from "@mantine/core";

import { DRFError } from "../utils/backend";

interface DRFErrorProps {
  error: DRFError;
}

export default function DRFErrorMessage({ error }: DRFErrorProps) {
  const errorMessage = error.errors.reduce((acc, err) => {
    if (err.attr) {
      return `${acc}Attribute: ${err.attr}\n`;
    }

    return `${acc}Code: ${err.code}\nDetail: ${err.detail}\n\n`;
  }, ``);
  return (
    <Stack gap="sm">
      <div>Error Type: {error.type}</div>
      <div>{errorMessage}</div>
    </Stack>
  );
}
