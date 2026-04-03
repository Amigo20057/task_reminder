#!/usr/bin/env node
import { Command } from "commander";
import { createTask, deleteTask, getList, updateTask } from "./commands";

import path from "path";
import fs from "fs";
import chalk from "chalk";
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
  .option("-d, --date <date>", "Filter by date")
  .option("-p, --priority <priority>", "Filter by priority")
  .option("-s, --status <status>", "Filter by status (done | todo)")
  .action((options) => {
    if (!fs.existsSync(csvFilePath)) {
      fs.writeFileSync(csvFilePath, "id,text,date,priority,done\n", "utf-8");
    }

    const csvFile = fs.readFileSync(csvFilePath);

    getList(csvFile, options);
  });

program
  .command("create")
  .description("Create new task")
  .option("-n, --name <name>", "Name for task")
  .option("-d, --date <date>", "Task date")
  .option("-p, --priority <priority>", "Task priority")
  .action((options) => {
    if (!options.name || !options.date || !options.priority) {
      console.log(
        "Please provide a task options with --name --date --priority",
      );
      return;
    }

    if (!fs.existsSync(csvFilePath)) {
      fs.writeFileSync(csvFilePath, "id,text,date,priority,done\n", "utf-8");
    }

    const csvFile = fs.readFileSync(csvFilePath);

    createTask(csvFile, csvFilePath, {
      text: options.name,
      date: options.date,
      priority: Number(options.priority) || 1,
    });
  });

program
  .command("delete <id>")
  .description("Delete task by ID")
  .action((idStr) => {
    const id = Number(idStr);
    if (isNaN(id)) {
      console.log(chalk.red("ID must be a number"));
      return;
    }

    if (!fs.existsSync(csvFilePath)) {
      console.log(chalk.red("Task file does not exist"));
      return;
    }

    deleteTask(csvFilePath, id);
  });

program
  .command("update <id>")
  .description("Update task by ID")
  .option("-n, --name <name>", "New task text")
  .option("-d, --date <date>", "New task date")
  .option("-p, --priority <priority>", "New task priority")
  .option("-s, --status <status>", "New task status (done|todo)")
  .action((idStr, options) => {
    const id = Number(idStr);
    if (isNaN(id)) {
      console.log(chalk.red("ID must be a number"));
      return;
    }

    const doneMap: Record<string, boolean> = {
      done: true,
      todo: false,
    };
    const done =
      options.status !== undefined ? doneMap[options.status] : undefined;

    updateTask(csvFilePath, id, {
      text: options.name,
      date: options.date,
      priority: options.priority ? Number(options.priority) : undefined,
      done,
    });
  });

program.parse(process.argv);
