import chalk from "chalk";
import Table from "cli-table3";
import { parse } from "csv/sync";
import fs from "fs";

type OptionsType = {
  date?: string;
  priority?: number;
  status?: "done" | "todo";
};

type TaskType = {
  id: number;
  text: string;
  date: string;
  priority: string;
  done: boolean;
};

type TaskInput = {
  text: string;
  date?: string;
  priority: number;
};

type UpdateOptions = {
  text?: string;
  date?: string;
  priority?: number;
  done?: boolean;
};

export const getList = (csvFile: Buffer, options: OptionsType) => {
  const rowRecords = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
  });

  let tasks = rowRecords.map((task: any) => ({
    id: Number(task.id),
    text: task.text,
    date: task.date,
    done: task.done === "true",
    priority: Number(task.priority),
  }));

  if (options.date) {
    tasks = tasks.filter((task) => task.date === options.date);
  }

  if (options.priority !== undefined) {
    tasks = tasks.filter((task) => task.priority === options.priority);
  }

  if (options.status) {
    const done = options.status === "done";
    tasks = tasks.filter((task) => task.done === done);
  }

  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks found"));
    return;
  }

  const table = new Table({
    head: ["ID", "Task", "Date", "Priority", "Status"],
    style: { head: ["cyan"] },
  });

  tasks.forEach((task) => {
    table.push([
      task.id,
      task.done ? chalk.strikethrough.gray(task.text) : task.text,
      chalk.cyan(task.date),
      task.priority > 3 ? chalk.red(task.priority) : chalk.green(task.priority),
      task.done ? chalk.green("✔") : chalk.red("✖"),
    ]);
  });

  console.log(table.toString());
};

export const createTask = (
  csvFile: Buffer,
  filePath: string,
  task: TaskInput,
) => {
  const rowRecords = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
  });

  const tasks = rowRecords.map((t: any) => ({
    id: Number(t.id),
  }));

  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  const safeText = `"${task.text.replace(/"/g, '""')}"`;

  const newRow = `${newId},${safeText},${task.date},${task.priority},false\n`;

  fs.appendFileSync(filePath, newRow);

  console.log(chalk.green("Task created successfully"));
};

export const deleteTask = (filePath: string, id: number) => {
  const csvFile = fs.readFileSync(filePath, "utf-8");

  const rows: TaskType[] = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
  }).map((row: any) => ({
    id: Number(row.id),
    text: row.text,
    date: row.date,
    priority: row.priority,
    done: row.done === "true",
  }));

  const index = rows.findIndex((task) => task.id === id);

  if (index === -1) {
    console.log(chalk.red(`Task with ID ${id} not found`));
    return;
  }

  rows.splice(index, 1);

  const updatedRows = rows.map((task, idx) => ({
    ...task,
    id: idx + 1,
  }));

  if (updatedRows.length === 0) {
    fs.writeFileSync(filePath, "id,text,date,priority,done\n", "utf-8");
    console.log(chalk.green("Task deleted. No tasks left."));
    return;
  }

  const header = Object.keys(updatedRows[0]).join(",") + "\n";
  const body = updatedRows
    .map(
      (task) =>
        `${task.id},"${task.text}",${task.date},${task.priority},${task.done}`,
    )
    .join("\n");

  fs.writeFileSync(filePath, header + body, "utf-8");

  console.log(chalk.green(`Task with ID ${id} deleted successfully`));
};

export const updateTask = (
  filePath: string,
  id: number,
  options: UpdateOptions,
) => {
  const csvFile = fs.readFileSync(filePath, "utf-8");

  const rows = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
  });

  const taskIndex = rows.findIndex((row: any) => Number(row.id) === id);

  if (taskIndex === -1) {
    console.log(chalk.red(`Task with ID ${id} not found`));
    return;
  }

  const task = rows[taskIndex] as TaskType;
  if (options.text !== undefined) task.text = options.text;
  if (options.date !== undefined) task.date = options.date;
  if (options.priority !== undefined) task.priority = String(options.priority);
  if (options.done !== undefined) task.done = options.done;

  const header = Object.keys(rows[0] as TaskType).join(",") + "\n";
  const body = rows
    .map(
      (row: any) =>
        `${row.id},${row.text},${row.date},${row.priority},${row.done}`,
    )
    .join("\n");

  fs.writeFileSync(filePath, header + body);

  console.log(chalk.green(`Task with ID ${id} updated successfully`));
};
