export const parseStatus = (input?: string): boolean | undefined => {
  if (!input) return undefined;

  const map: Record<string, boolean> = {
    done: true,
    todo: false,
  };

  const status = map[input.toLowerCase()];
  if (status === undefined) {
    throw new Error("Invalid status. Use 'done' or 'todo'.");
  }

  return status;
};

export const parseDate = (input?: string): string | undefined => {
  if (!input) return undefined;

  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!regex.test(input)) {
    throw new Error("Invalid date format. Use DD.MM.YYYY");
  }

  return input;
};
