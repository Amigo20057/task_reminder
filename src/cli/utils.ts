export const parseDate = (date?: string): string | undefined => {
  if (!date) return undefined;
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
    throw new Error("Invalid date format. Use DD.MM.YYYY");
  }
  return date;
};

export const parseStatus = (status?: string): "done" | "todo" | undefined => {
  if (!status) return undefined;
  if (status !== "done" && status !== "todo") {
    throw new Error("Invalid status. Use 'done' or 'todo'");
  }
  return status;
};

export const parsePriority = (priority?: string): number | undefined => {
  if (!priority) return undefined;
  const num = Number(priority);
  if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 4) {
    throw new Error("Invalid priority. Use a number from 1 to 4");
  }
  return num;
};
