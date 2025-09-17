# GitHub Project Setup Guide

This guide will walk you through setting up the EpiTrello GitHub Project with all the required tasks.

## 📋 Step 1: Create GitHub Project

1. **Navigate to your repository** on GitHub
2. **Click the "Projects" tab** at the top of the repository
3. **Click "New Project"** button
4. **Choose "Board"** as the project type
5. **Name your project** "EpiTrello"
6. **Add description**: "Web-based project management application inspired by Trello"

## 🏗️ Step 2: Set Up Project Columns

Create the following columns in your project board:

### Column 1: 📋 To Do
- **Purpose**: Tasks that are planned but not yet started
- **Description**: "Tasks ready to be picked up by developers"

### Column 2: 🚧 In Progress
- **Purpose**: Tasks currently being worked on
- **Description**: "Tasks actively being developed"

### Column 3: ✅ Done
- **Purpose**: Completed tasks
- **Description**: "Tasks that have been completed and merged"

## 🎯 Step 3: Create GitHub Issues

Choose one of the following methods:

### Method A: Automated Creation (Recommended)

```bash
# Make sure you have GitHub CLI installed and authenticated
gh auth login

# Run the automated script
node scripts/create-issues.js
```

This will create all 24 tasks as GitHub issues with proper labels and formatting.

### Method B: Manual Creation

For each task in [`project-tasks.json`](./project-tasks.json):

1. **Go to Issues tab** in your repository
2. **Click "New Issue"**
3. **Select "EpiTrello Development Task" template**
4. **Fill in the task details** from the project-tasks.json file
5. **Add appropriate labels**: `task`, priority level, effort level
6. **Create the issue**

## 📌 Step 4: Add Issues to Project

1. **Go to your project board**
2. **Click "Add items"** button
3. **Search for and select** all the task issues you created
4. **Add them to the project**
5. **All issues will initially be in "To Do" column**

## 🏷️ Step 5: Configure Labels

Create the following labels in your repository (Issues → Labels → New label):

### Priority Labels
- `high` - 🔴 High priority tasks (critical path)
- `medium` - 🟡 Medium priority tasks
- `low` - 🟢 Low priority tasks

### Effort Labels  
- `small` - 🔹 Small effort (< 1 day)
- `medium` - 🔷 Medium effort (1-3 days)
- `large` - 🔶 Large effort (> 3 days)

### Type Labels
- `task` - 📋 Development task
- `foundation` - 🏗️ Foundation & setup work
- `feature` - ✨ Feature development
- `infrastructure` - ⚙️ Infrastructure work

## 🔄 Step 6: Set Up Automation (Optional)

The repository includes a GitHub Actions workflow (`.github/workflows/project-management.yml`) that can automatically:
- Add new issues to the project
- Move completed issues to "Done" column

To enable this:
1. **Make sure GitHub Actions are enabled** in your repository settings
2. **The workflow will automatically trigger** when issues are opened/closed

## 📊 Step 7: Project Management Best Practices

### Moving Tasks Between Columns

- **To Do → In Progress**: When you start working on a task
- **In Progress → Done**: When the task is completed and merged

### Task Dependencies

Follow the dependency chain defined in `project-tasks.json`:
1. Start with **Environment Setup** and **Folders Setup**
2. Move to **Authentication** and **Organizations**
3. Follow the logical progression through each phase

### Development Workflow

1. **Pick a task** from "To Do" column
2. **Assign yourself** to the issue
3. **Move to "In Progress"**
4. **Create a feature branch**
5. **Develop the feature** following acceptance criteria
6. **Create pull request**
7. **Get code review**
8. **Merge to main**
9. **Move task to "Done"**

## 🎯 Development Phases Overview

### Phase 1: Foundation & Setup
- Environment Setup
- Folders Setup  
- Marketing Page

### Phase 2: Core Authentication & Organization
- Authentication
- Organizations
- Workspace Settings

### Phase 3: UI Components & Navigation
- Sidebar
- Server Actions
- useAction abstraction
- Form Components

### Phase 4: Board Management
- Board Popover Form
- Board Server Action
- Board List
- Board Page

### Phase 5: List Management
- List Component
- List Header
- List Options

### Phase 6: Card Management
- Card Form
- Drag n' Drop
- Card Modal
- Card Actions

### Phase 7: Advanced Features
- Activity Logs
- Stripe & Board Limits

### Phase 8: Deployment
- Deployment

## ✅ Verification

After setup, you should have:
- [ ] GitHub Project "EpiTrello" created
- [ ] Three columns: To Do, In Progress, Done
- [ ] 24 issues created with proper labels
- [ ] All issues added to the project in "To Do" column
- [ ] Labels configured for priority and effort
- [ ] GitHub Actions workflow enabled (optional)

## 🚀 Ready to Start!

Your EpiTrello project is now ready for development. Start with the Foundation & Setup phase and work through the tasks systematically following the dependency chain.

Good luck building your Trello clone! 🎉