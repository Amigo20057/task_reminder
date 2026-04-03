#!/usr/bin/env node
import { Command } from "commander";
import { createTask, deleteTask, getList, updateTask } from "./commands";

import path from "path";
import fs from "fs";
import chalk from "chalk";
import { parseDate, parsePriority, parseStatus } from "./utils";

const packageJson = require(path.join(__dirname, "../../../package.json"));
const csvFilePath = path.join(__dirname, "../../../data.csv");
const { version } = packageJson;

const program = new Command();

program.version(version);

program
  .name("taskr")
  .description("Simple task manager CLI")
  .showHelpAfterError();

program
  .command("list")
  .description("Show tasks")
  .option("-d, --date <date>", "Filter by date DD.MM.YYYY")
  .option("-p, --priority <priority>", "Filter by priority (1-4)")
  .option("-s, --status <status>", "Filter by status (done | todo)")
  .action((options) => {
    try {
      if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(csvFilePath, "id,text,date,priority,done\n", "utf-8");
      }
      const csvFile = fs.readFileSync(csvFilePath);
      const date = parseDate(options.date);
      const status = parseStatus(options.status);
      const priority = parsePriority(options.priority);
      getList(csvFile, { date, priority, status });
    } catch (err: any) {
      console.log(chalk.red(err.message));
    }
  });

program
  .command("create")
  .description("Create new task")
  .option("-n, --name <name>", "Name for task")
  .option("-d, --date <date>", "Task date DD.MM.YYYY")
  .option("-p, --priority <priority>", "Task priority (1-4)")
  .action((options) => {
    try {
      if (!options.name)
        throw new Error("Please provide task name with --name");
      if (!options.date)
        throw new Error("Please provide task date with --date");
      if (!options.priority)
        throw new Error("Please provide task priority with --priority");

      const date = parseDate(options.date);
      const priority = parsePriority(options.priority)!;

      if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(csvFilePath, "id,text,date,priority,done\n", "utf-8");
      }
      const csvFile = fs.readFileSync(csvFilePath);
      createTask(csvFile, csvFilePath, { text: options.name, date, priority });
    } catch (err: any) {
      console.log(chalk.red(err.message));
    }
  });

program
  .command("delete <id>")
  .description("Delete task by ID")
  .action((idStr) => {
    try {
      const id = Number(idStr);
      if (isNaN(id) || !Number.isInteger(id) || id < 1) {
        throw new Error("ID must be a positive integer");
      }
      if (!fs.existsSync(csvFilePath)) {
        throw new Error("Task file does not exist");
      }
      deleteTask(csvFilePath, id);
    } catch (err: any) {
      console.log(chalk.red(err.message));
    }
  });

program
  .command("update <id>")
  .description("Update task by ID")
  .option("-n, --name <name>", "New task text")
  .option("-d, --date <date>", "New task date DD.MM.YYYY")
  .option("-p, --priority <priority>", "New task priority (1-4)")
  .option("-s, --status <status>", "New task status (done | todo)")
  .action((idStr, options) => {
    try {
      const id = Number(idStr);
      if (isNaN(id) || !Number.isInteger(id) || id < 1) {
        throw new Error("ID must be a positive integer");
      }

      if (!fs.existsSync(csvFilePath)) {
        throw new Error("Task file does not exist");
      }

      const date = parseDate(options.date);
      const priority = parsePriority(options.priority);
      const status = parseStatus(options.status);

      let done: boolean | undefined;
      if (status === "done") done = true;
      else if (status === "todo") done = false;

      if (
        !options.name &&
        !options.date &&
        !options.priority &&
        !options.status
      ) {
        throw new Error(
          "Please provide at least one option to update: --name, --date, --priority, --status",
        );
      }

      updateTask(csvFilePath, id, { text: options.name, date, priority, done });
    } catch (err: any) {
      console.log(chalk.red(err.message));
    }
  });

program.parse(process.argv);
