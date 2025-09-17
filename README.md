# EpiTrello

EpiTrello is a web-based project management application inspired by Trello and the Kanban method. It allows you to create boards containing lists of cards representing tasks. Each card can be assigned to a user, moved between lists to reflect its progress, and enriched with details such as a description, deadline, or tags.

## 🚀 Project Setup

This repository includes a comprehensive project management setup with all development tasks organized and ready for implementation.

### 📋 Project Structure

The project is organized into **3 main columns**:
- **📋 To Do** - Tasks that are planned but not yet started
- **🚧 In Progress** - Tasks currently being worked on  
- **✅ Done** - Completed tasks

### 🎯 Development Tasks

The project includes **24 comprehensive tasks** covering the complete development lifecycle:

1. **Environment Setup** - Development environment and tooling
2. **Folders Setup** - Project structure organization
3. **Marketing Page** - Landing page and initial UI
4. **Authentication** - User authentication system
5. **Organizations** - Multi-user workspace management
6. **Sidebar** - Navigation components
7. **Workspace Settings** - Configuration management
8. **Server Actions** - Backend action handlers
9. **useAction abstraction** - Reusable action hooks
10. **Form Components** - Reusable UI components
11. **Board Popover Form** - Board creation interface
12. **Board Server Action** - Board management backend
13. **Board List** - Board listing functionality
14. **Board Page** - Individual board pages
15. **List Component** - List management components
16. **List Header** - List header functionality
17. **List Options** - List management options
18. **Card Form** - Card creation and editing
19. **Drag n' Drop** - Interactive card movement
20. **Card Modal** - Detailed card view
21. **Card Actions** - Card management actions
22. **Activity Logs** - User activity tracking
23. **Stripe & Board Limits** - Payment and limits
24. **Deployment** - Production deployment

## 🛠️ Getting Started

### Option 1: Automated Setup (Recommended)

1. **Install GitHub CLI** if not already installed:
   ```bash
   # macOS
   brew install gh
   
   # Ubuntu/Debian
   sudo apt install gh
   
   # Windows
   winget install GitHub.cli
   ```

2. **Authenticate with GitHub**:
   ```bash
   gh auth login
   ```

3. **Create all project issues**:
   ```bash
   node scripts/create-issues.js
   ```

4. **Create GitHub Project**:
   - Go to your GitHub repository
   - Click "Projects" tab
   - Click "New Project"
   - Choose "Board" template
   - Name it "EpiTrello"
   - Add columns: "To Do", "In Progress", "Done"
   - Add the created issues to the project

### Option 2: Manual Setup

1. Review the [`PROJECT_ROADMAP.md`](./PROJECT_ROADMAP.md) file
2. Review the [`project-tasks.json`](./project-tasks.json) file for detailed task definitions
3. Create GitHub issues manually using the template in [`.github/ISSUE_TEMPLATE/task.md`](./.github/ISSUE_TEMPLATE/task.md)
4. Set up GitHub Project with the three columns
5. Organize issues in the appropriate columns

## 📁 Project Files

- **[`PROJECT_ROADMAP.md`](./PROJECT_ROADMAP.md)** - Complete project roadmap and task organization
- **[`project-tasks.json`](./project-tasks.json)** - Detailed task definitions with all metadata
- **[`scripts/create-issues.js`](./scripts/create-issues.js)** - Automated issue creation script
- **[`.github/ISSUE_TEMPLATE/task.md`](./.github/ISSUE_TEMPLATE/task.md)** - GitHub issue template for tasks
- **[`.github/workflows/project-management.yml`](./.github/workflows/project-management.yml)** - GitHub Actions for project automation

## 🎯 Development Phases

The project is organized into logical development phases:

1. **Foundation & Setup** (Tasks 1-3)
2. **Core Authentication & Organization** (Tasks 4-5, 7)
3. **UI Components & Navigation** (Tasks 6, 8-10)
4. **Board Management** (Tasks 11-14)
5. **List Management** (Tasks 15-17)
6. **Card Management** (Tasks 18-21)
7. **Advanced Features** (Tasks 22-23)
8. **Deployment** (Task 24)

## 🤝 Contributing

1. Check the project board for available tasks
2. Assign yourself to a task in the "To Do" column
3. Move the task to "In Progress" when you start working
4. Create a feature branch for your work
5. Submit a pull request when ready
6. Move the task to "Done" when completed and merged

## 📝 Task Management

Each task includes:
- ✅ **Acceptance Criteria** - Clear requirements for completion
- 🔧 **Technical Requirements** - Implementation guidelines
- 📋 **Dependencies** - Required prerequisite tasks
- 🎯 **Priority Level** - High, Medium, or Low
- ⏱️ **Effort Estimate** - Small, Medium, or Large

## 🚀 Next Steps

1. Set up the GitHub Project board
2. Create issues for all tasks (use the script for automation)
3. Start with the Foundation & Setup phase
4. Follow the dependency chain for optimal development flow

Happy coding! 🎉
