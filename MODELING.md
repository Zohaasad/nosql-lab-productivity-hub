Here is the complete file, copy everything below:

```markdown
# Schema Design — Personal Productivity Hub

## 1. Collections Overview

- **users** — Stores registered user accounts with hashed passwords. Each user owns projects and notes.
- **projects** — Represents a group of related tasks owned by a user. Can be active or archived.
- **tasks** — Stores individual tasks belonging to a project, with embedded subtasks and tags.
- **notes** — Stores text notes that can be standalone or optionally linked to a project.

---

## 2. Document Shapes

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  name: string (required),
  description: string (optional),
  archived: boolean (required, default: false),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  projectId: ObjectId (required, ref: projects),
  title: string (required),
  status: string (required, one of: "todo" | "in-progress" | "done"),
  priority: number (required, default: 1),
  tags: string[] (required, default: []),
  subtasks: [{ title: string, done: boolean }] (required, default: []),
  dueDate: Date (optional),
  createdAt: Date (required)
}
```

### notes
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  projectId: ObjectId (optional, ref: projects),
  title: string (required),
  body: string (required),
  tags: string[] (required, default: []),
  createdAt: Date (required)
}
```

---

## 3. Embed vs Reference — Decisions

| Relationship | Embed or Reference? | Why? |
|---|---|---|
| Subtasks inside a task | Embed | Subtasks belong exclusively to one task and are always read together with it, so a single document fetch retrieves everything. |
| Tags on a task | Embed | Tags are simple strings with no independent existence, so storing them as an array inside the task avoids unnecessary lookups. |
| Project → Task ownership | Reference (projectId in task) | Tasks are queried independently by status and priority, so they need their own collection rather than being nested inside a project document. |
| Note → optional Project link | Reference (projectId, optional) | Notes can exist without a project, so a reference is stored only when needed and omitted entirely for standalone notes. |

---

## 4. Schema Flexibility Example

**Field:** `dueDate` on tasks

Some tasks have a `dueDate` and others do not. In a relational database this would require a nullable column for every row. In MongoDB, the field is simply omitted from documents that do not need it. This keeps documents clean and makes it easy to query tasks that have a deadline using `{ dueDate: { $exists: true } }` without any null-handling logic.
```