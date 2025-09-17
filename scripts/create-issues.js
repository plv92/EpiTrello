#!/usr/bin/env node

/**
 * Script to generate GitHub issues from project-tasks.json
 * This script can be run to create all the defined tasks as GitHub issues
 * 
 * Usage: node scripts/create-issues.js
 * 
 * Requirements:
 * - GitHub CLI (gh) installed and authenticated
 * - project-tasks.json file in the root directory
 */

const fs = require('fs');
const { execSync } = require('child_process');

function loadTasks() {
  try {
    const data = fs.readFileSync('project-tasks.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading project-tasks.json:', error.message);
    process.exit(1);
  }
}

function createIssueBody(task) {
  return `## Task Description
${task.description}

## Phase
${task.phase}

## Acceptance Criteria
${task.acceptanceCriteria.map(criteria => `- [ ] ${criteria}`).join('\n')}

## Technical Requirements
${task.technicalRequirements.map(req => `- ${req}`).join('\n')}

## Dependencies
${task.dependencies.length > 0 ? task.dependencies.map(dep => `- ${dep}`).join('\n') : '_No dependencies_'}

## Definition of Done
- [ ] Code implemented and tested
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Merged to main branch

## Priority
${task.priority}

## Estimated Effort
${task.effort}

## Notes
Task ID: ${task.id}
Initial Column: ${task.column}`;
}

function createIssue(task) {
  const title = `[TASK] ${task.title}`;
  const body = createIssueBody(task);
  const labels = ['task', task.priority.toLowerCase(), task.effort.toLowerCase()];
  
  try {
    const command = `gh issue create --title "${title}" --body "${body.replace(/"/g, '\\"')}" --label "${labels.join(',')}"`;
    console.log(`Creating issue: ${task.title}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Created issue: ${task.title}\n`);
  } catch (error) {
    console.error(`❌ Failed to create issue: ${task.title}`);
    console.error(error.message);
  }
}

function main() {
  console.log('🚀 Creating GitHub issues from project-tasks.json...\n');
  
  const projectData = loadTasks();
  
  if (!projectData.tasks || !Array.isArray(projectData.tasks)) {
    console.error('Invalid project-tasks.json format: missing tasks array');
    process.exit(1);
  }
  
  console.log(`Found ${projectData.tasks.length} tasks to create...\n`);
  
  // Sort tasks by ID to maintain order
  const sortedTasks = projectData.tasks.sort((a, b) => a.id - b.id);
  
  sortedTasks.forEach(task => {
    createIssue(task);
  });
  
  console.log('✅ All issues created successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Create a GitHub Project with columns: To Do, In Progress, Done');
  console.log('2. Add the created issues to the project');
  console.log('3. Organize issues in the appropriate columns');
}

if (require.main === module) {
  main();
}

module.exports = { loadTasks, createIssueBody, createIssue };