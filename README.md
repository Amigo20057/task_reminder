# task_reminder

A simple CLI tool for managing tasks from the terminal.

## Installation

```bash
git clone https://github.com/your-username/taskr.git
cd taskr
npm install
npm link
```

## Usage

```bash
taskr <command> [options]
```

## Commands

### list

Display tasks.

```bash
taskr list
```

#### Options

```bash
-d, --date <date>         Filter tasks by date (DD.MM.YYYY)
-p, --priority <number>   Filter tasks by priority
-s, --status <status>     Filter by status (done | todo)
```

#### Examples

```bash
taskr list
taskr list -d 05.04.2026
taskr list -p 2
taskr list -s done
taskr list -d 05.04.2026 -p 2 -s todo
```

### create

Create a new task.

```bash
taskr create --name "Buy groceries" --date 05.04.2026 --priority 2
```

#### Options

```bash
-n, --name <name>         Name of the task
-d, --date <date>         Task date (DD.MM.YYYY)
-p, --priority <number>   Task priority (number)
```

### delete

Delete a task by its ID.

```bash
taskr delete 1
```

### update

Update a task by its ID.

```bash
taskr update 1 --name "New task name" --date 06.04.2026 --priority 3 --status done
```

#### Options

```bash
-n, --name <name>         New task text
-d, --date <date>         New task date (DD.MM.YYYY)
-p, --priority <number>   New task priority
-s, --status <status>     New task status (done | todo)
```

## Data format

Tasks are stored in a `data.csv` file:

```csv
id,text,date,priority,done
1,Task example,05.04.2026,2,false
```

- `id` – unique task ID
- `text` – task description
- `date` – date in DD.MM.YYYY format
- `priority` – task priority as number
- `done` – task status (`true` or `false`)

## Notes

- The CLI validates the `date` format (`DD.MM.YYYY`) and `status` (`done` or `todo`).
- Task IDs are automatically recalculated after deletion.
- If the CSV file does not exist, it is created automatically.

## Tech stack

- Node.js
- TypeScript
- commander
- chalk
- csv
- cli-table3
