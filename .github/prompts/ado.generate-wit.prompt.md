---
mode: agent
description: Generate Azure DevOps Work Items directly using ADO tools from generated spec and plan.
---

**User input context**: $ARGUMENTS
 
## Prerequisites
 
1. **Identify Azure DevOps Project**: Ask user for project name/ID if not provided in $ARGUMENTS
 
2. **Locate Feature Artifacts**: Use spec-workflow to indicate the spec requirements folder path containing:
   - `requirements.md`
   - `design.md`
   - `tasks.md`

3. **Load and Analyze Feature Artifacts**:
   - Read `requirements.md` for feature overview, acceptance criteria, and scope
   - **EXTRACT**: Parse acceptance scenarios from requirements.md "User Scenarios & Testing" section
   - Read `tasks.md` for detailed implementation tasks
   - Read `design.md` for technical approach and architecture decisions
 
## Task Naming Convention
 
Tasks should follow this standardized naming pattern:
 
**Pattern**: `Product Type | Type of Work | Task PIC Role | Task Details`
 
**Example**: `Source Code | Create | BE | Create model for QuestionSet data`
 
### 1. Product Type Categories:
- **Source Code** - Tasks related to coding, implementation, development
- **Unit Test Case** - Tasks related to TDD (Test-Driven Development)
- **Integration Test Case** - Tasks related to BDD (Behavior-Driven Development)  
- **Documentation** - Tasks related to spikes, research, documentation
 
### 2. Type of Work Categories:
- **Study** - Research, investigation, learning tasks
- **Create** - New implementation, initial development
- **Update** - Modifications to existing code/features
- **Review** - Tech lead code review activities
- **Correct** - Bug fixes and defect resolution
 
### 3. Task PIC (Person In Charge) Roles:
- **PO** - Product Owner
- **FE** - Front End Developer
- **BE** - Back End Developer  
- **DO** - DevOps Engineer (Terraform, infrastructure)
- **AT** - Automation Test Engineer
 
### Naming Examples:
- `Source Code | Create | FE | Implement user dashboard component`
- `Unit Test Case | Create | BE | Write unit tests for user service`
- `Integration Test Case | Create | AT | Create E2E test for login flow`
- `Documentation | Study | PO | Research user requirements for feature X`
- `Source Code | Update | BE | Add validation to user registration API`
- `Source Code | Correct | FE | Fix responsive layout issues on mobile`
- `Source Code | Review | BE | Review authentication middleware implementation`
 
## Acceptance Criteria Format Requirements
 
**ALL acceptance criteria MUST follow the Given-When-Then (GWT) format using markdown bold formatting:**
 
### Format Template:
Use Gherkin-style syntax:
```
**GIVEN** [precondition/context] 
**WHEN** [action/trigger] 
**THEN** [expected outcome]
```
 
### Guidelines:
- **Use specific, testable outcomes** rather than vague descriptions
- **Include technical context** relevant to the work item level
- **Maintain consistency** across related work items
- **Focus on behavior** that can be verified/tested

### Mapping Rules:

#### Feature Level (1 per feature):
- Title: Feature name from spec.md title
- Work Item Type: "Feature"
- Priority: 2 (default for features)
- State: "New" (safest for creation)
- Tags: "feature-implementation"
- Description: Feature overview from spec.md
- Acceptance Criteria: **GIVEN** [context] **WHEN** [action] **THEN** [outcome] - Extract from Primary User Story in spec.md (max 200 chars)
 
#### Product Backlog Item Level (Group related tasks):
Group related tasks into PBIs:
- "Setup and Infrastructure" - for T001-T003 type setup tasks
- "Core Implementation" - for main business logic tasks
- "API Development" - for endpoint/contract implementation
- "Data Layer" - for model and database tasks  
- "Testing and Quality" - for test implementation tasks
- "Integration and Deployment" - for deployment and integration tasks

PBI Configuration:
- Work Item Type: "Product Backlog Item"
- Priority: 2 for core features, 1 for testing/quality
- State: "New" (will need approval workflow)
- Tags: Derive from PBI category (infrastructure, api, data-layer, testing, etc.)
- Description: Summary of tasks included in this PBI
- Acceptance Criteria: **GIVEN** [prerequisite state] **WHEN** [PBI is completed] **THEN** [expected functionality is available]
 
#### Task Level (Individual tasks from tasks.md):
- Title: Follow the naming convention pattern: `Product Type | Type of Work | Task PIC Role | Task Details`
- Work Item Type: "Task"
- Remove T001, T002 prefixes from tasks.md and convert to standardized format
- Priority: 1 for all individual tasks
- State: "To Do" (ready for sprint planning)
- Tags: Derive from task type (setup, model, service, test, api, etc.)
- Description: Detailed description from tasks.md
- Acceptance Criteria: **GIVEN** [development environment] **WHEN** [task is implemented] **THEN** [specific deliverable exists and functions]
 
### 3. Work Item States (Based on Team Magnolia Azure DevOps Configuration):
#### Feature States:
- "New" - Initial state for new features ✅ **RECOMMENDED FOR CREATION**
- "In Progress" - Feature currently being developed
- "Analysis" - Feature in analysis/design phase
- "Blocked" - Feature has impediments
- "Parked" - Feature temporarily on hold
- "In Warranty" - Feature completed, in warranty period
- "Done" - Feature fully completed
- "Removed" - Feature cancelled/removed
 
#### Product Backlog Item (PBI) States:
- "New" - Initial state for new PBIs ✅ **RECOMMENDED FOR CREATION**
- "Approved" - PBI approved for development
- "Development" - PBI in active development
- "Testing" - PBI in testing phase
- "Analysis" - PBI in analysis/design phase
- "Blocked" - PBI has impediments
- "Peer Review" - PBI in code/design review
- "In Warranty" - PBI completed, in warranty period
 
#### Task States:
- "To Do" - Task ready to start ✅ **RECOMMENDED FOR CREATION**
- "In Progress" - Task actively being worked
- "Testing" - Task in testing phase
- "Done" - Task completed
- "Removed" - Task cancelled/removed

## Work Item Creation Process

### Step 1: Create Feature Work Item
Use `wit_create_work_item` tool with:
- **project**: Azure DevOps project name/ID
- **workItemType**: "Feature"
- **fields**: Array of field objects:
  ```json
  [
    {"name": "System.Title", "value": "[Feature title from spec.md]"},
    {"name": "System.Description", "value": "[Feature overview from spec.md]", "format": "Html"},
    {"name": "Microsoft.VSTS.Common.AcceptanceCriteria", "value": "[GWT format criteria]", "format": "Html"},
    {"name": "Microsoft.VSTS.Common.Priority", "value": "2"},
    {"name": "System.State", "value": "New"},
    {"name": "System.Tags", "value": "feature-implementation"}
  ]
  ```
- **Store the returned Feature ID** for linking child PBIs

### Step 2: Create Product Backlog Item Work Items
For each PBI grouping, use `wit_create_work_item` tool with:
- **project**: Azure DevOps project name/ID
- **workItemType**: "Product Backlog Item"
- **fields**: Array of field objects including all standard fields plus:
  ```json
  [
    {"name": "System.Title", "value": "[PBI title]"},
    {"name": "System.Description", "value": "[PBI description]", "format": "Html"},
    {"name": "Microsoft.VSTS.Common.AcceptanceCriteria", "value": "[GWT format criteria]", "format": "Html"}, {"name": "Microsoft.VSTS.Common.Priority", "value": "2"},
    {"name": "System.State", "value": "New"},
    {"name": "System.Tags", "value": "[pbi-category-tags]"}
  ]
  ```
- **After creation, link to Feature parent** using `wit_work_items_link` tool:
  - **project**: Azure DevOps project name/ID
  - **updates**: Array with single update object:
    ```json
    [{
      "id": [PBI_ID],
      "linkToId": [FEATURE_ID],
      "type": "parent"
    }]
    ```
- **Store the returned PBI ID** for linking child Tasks

### Step 3: Create Task Work Items
For each task from tasks.md, use `wit_create_work_item` tool with:
- **project**: Azure DevOps project name/ID
- **workItemType**: "Task"
- **fields**: Array of field objects:
  ```json
  [
    {"name": "System.Title", "value": "[Task title in naming convention format]"},
    {"name": "System.Description", "value": "[Task details from tasks.md]", "format": "Html"},
    {"name": "Microsoft.VSTS.Common.AcceptanceCriteria", "value": "[GWT format criteria]", "format": "Html"},
    {"name": "Microsoft.VSTS.Common.Priority", "value": "1"},
    {"name": "System.State", "value": "To Do"},
    {"name": "System.Tags", "value": "[task-type-tags]"}
  ]
  ```
- **After creation, link to PBI parent** using `wit_work_items_link` tool:
  - **project**: Azure DevOps project name/ID
  - **updates**: Array with single update object:
    ```json
    [{
      "id": [TASK_ID],
      "linkToId": [PBI_ID],
      "type": "parent"
    }]
    ```

### Step 4: Summarize Created Work Items
After all work items are created and linked, provide a summary:
- Feature ID and title with Azure DevOps URL
- List of PBI IDs with titles and their Azure DevOps URLs
- Count of Tasks created under each PBI with Azure DevOps URLs
- Hierarchy visualization in markdown format

## Error Handling
- If any work item creation fails, log the error and continue with remaining items
- Report all failures at the end with specific error messages
- Suggest manual creation steps for failed items
 
### Key Points:
- **Use Azure DevOps MCP tools** to create work items directly
- **Maintain hierarchy** by creating Feature → PBIs → Tasks in order
- **Link parent-child relationships** immediately after creating child items
- **Store work item IDs** after creation for linking and reference
- **Acceptance Criteria MUST use Given-When-Then format** with markdown bold formatting
  - Format: `**GIVEN** [context] **WHEN** [action] **THEN** [expected outcome]`
- **Task titles follow naming convention**: `Product Type | Type of Work | Task PIC Role | Task Details`
- **Use Html format** for description and acceptance criteria fields
- **Create work items sequentially** to ensure proper parent IDs are available for linking

## Azure DevOps Tools Reference

### Available MCP Tools:
1. **wit_create_work_item** - Create individual work items
   - Parameters: project, workItemType, fields[]
   - Returns: Work item ID and details

2. **wit_work_items_link** - Link work items together
   - Parameters: project, updates[] (with id, linkToId, type)
   - Types: "parent", "child", "related"

3. **wit_get_work_item** - Retrieve work item details
   - Parameters: project, id, expand
   - Use to verify created items

4. **wit_add_child_work_items** - Create multiple child work items at once
   - Parameters: project, parentId, workItemType, items[]
   - More efficient for creating multiple tasks under one PBI

### Field Name Reference (System Fields):
- **System.Title** - Work item title
- **System.Description** - Detailed description (Html/Markdown)
- **System.State** - Current state (New, In Progress, etc.)
- **System.Tags** - Semicolon-separated tags
- **Microsoft.VSTS.Common.Priority** - Priority level (1-4)
- **Microsoft.VSTS.Common.AcceptanceCriteria** - Acceptance criteria (Html/Markdown)
- **System.AreaPath** - Area path (defaults to project root)
- **System.IterationPath** - Iteration path (defaults to project root)
