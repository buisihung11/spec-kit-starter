# Requirements Document

## Introduction

The **Question Set List UI** feature provides users with an interface to view available question sets (forms) and complete them through a multi-step form workflow. This component serves as the entry point for the form-filling workflow within the newInstructionsUI application. Users will see a list of available question sets, including both functional and non-functional templates, select a specific form to retrieve from the form service, and then progress through multiple steps where each step contains related questions grouped together. This multi-step approach improves the user experience by breaking down complex forms into manageable sections and providing a clear sense of progress. This feature enables claims adjusters and operations staff to quickly identify and access the appropriate form template for their manual instruction entry needs.

## Alignment with Product Vision

This feature directly supports the **Manual Instruction Creation Form** key feature outlined in product.md by providing the first step in the instruction creation workflow. It aligns with the following product principles:

- **Simplicity First**: The list UI provides a clean, intuitive interface for form selection without requiring extensive training
- **Quality by Design**: Clear labeling of functional vs. non-functional templates helps users make the right choice upfront
- **Integration-Ready**: The form retrieval mechanism integrates with the downstream form service, enabling seamless data flow

By enabling users to quickly browse and select the correct form template, this feature contributes to the business objective of **increasing operational efficiency** by reducing time spent searching for or choosing the right form for exception handling scenarios.

## Requirements

### Requirement 1: Display Available Question Sets

**User Story:** As a claims adjuster, I want to see a list of available question sets, so that I can choose the appropriate form for my claim instruction entry task.

#### Acceptance Criteria

1. WHEN the Question Set List UI loads THEN the system SHALL display a list containing at least two question sets:
   - "Motor Claims Form Template" (functional)
   - "Generic Motor Claims" (marked as not functional)

2. WHEN displaying each question set THEN the system SHALL show:
   - The question set name/title
   - A visual indicator of functionality status (functional vs. non-functional)

3. WHEN a question set is marked as non-functional THEN the system SHALL clearly indicate this status to prevent user confusion

4. IF no question sets are available THEN the system SHALL display an appropriate empty state message

### Requirement 2: Display Selected Question Set as Multi-Step Form

**User Story:** As a claims adjuster, I want to complete a selected question set through multiple steps with related questions grouped together, so that I can work through complex forms in a structured and manageable way without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN a user selects a functional question set THEN the system SHALL fetch the complete form data from the form service

2. WHEN fetching form data THEN the system SHALL display a loading indicator to provide feedback to the user

3. WHEN form data is successfully retrieved THEN the system SHALL analyze the questions and organize them into logical steps based on:
   - Question categories or groupings defined in the form data
   - Related question topics or themes
   - A default grouping strategy if no explicit grouping is provided (e.g., maximum 5-7 questions per step)

4. WHEN displaying the multi-step form THEN the system SHALL show:
   - The current step number and total steps (e.g., "Step 1 of 4")
   - All questions belonging to the current step
   - Navigation controls to move between steps
   - A progress indicator showing completion status

5. WHEN a user is on any step except the first THEN the system SHALL display a "Previous" button to navigate to the prior step

6. WHEN a user is on any step except the last THEN the system SHALL display a "Next" button to navigate to the following step

7. WHEN a user is on the last step THEN the system SHALL display a "Submit" button instead of "Next"

8. WHEN a user navigates between steps THEN the system SHALL:
   - Preserve all previously entered data
   - Not require validation to move backward
   - Optionally validate current step before allowing forward navigation (configurable behavior)

9. IF the form service request fails THEN the system SHALL display an error message explaining that the form could not be retrieved

10. WHEN a user selects a non-functional question set (e.g., "Generic Motor Claims") THEN the system SHALL either:
    - Disable the selection action, OR
    - Display a message indicating the form is not yet available

11. IF a form takes longer than 3 seconds to load THEN the system SHALL continue showing the loading indicator without timeout

12. WHEN the user submits the final step THEN the system SHALL collect all data from all steps and process it according to downstream requirements

### Requirement 3: Provide Visual Feedback and Navigation for Multi-Step Form

**User Story:** As a claims adjuster, I want clear visual feedback and intuitive navigation when working through a multi-step form, so that I understand my progress, can easily move between steps, and know what actions are available at each stage.

#### Acceptance Criteria

1. WHEN a user hovers over a selectable question set THEN the system SHALL provide visual feedback (e.g., highlight, hover state)

2. WHEN a question set is actively loading THEN the system SHALL disable further selections until the current operation completes

3. WHEN a user has selected a question set and the form is being fetched THEN the system SHALL indicate which question set is being loaded

4. WHEN displaying a multi-step form THEN the system SHALL show:
   - A step indicator showing current position (e.g., "Step 2 of 5")
   - A visual progress bar or stepper component indicating overall completion
   - Clear section headings or titles for each step

5. WHEN a user navigates to a new step THEN the system SHALL:
   - Smoothly transition to the new step content
   - Scroll to the top of the form content
   - Update the progress indicator to reflect the current position

6. WHEN navigation buttons are clicked THEN the system SHALL provide immediate visual feedback (e.g., button press state, loading state if validation occurs)

7. WHEN the user is filling out a step THEN the system SHALL indicate which fields are required vs. optional

8. IF a step has validation errors THEN the system SHALL:
   - Clearly highlight the fields with errors
   - Display error messages near the relevant fields
   - Prevent navigation to the next step until errors are resolved (if validation is required)

9. WHEN the user reaches the final step THEN the system SHALL clearly indicate this is the last step before submission

10. WHEN the form is being submitted THEN the system SHALL:
    - Disable the submit button to prevent duplicate submissions
    - Display a loading indicator
    - Provide feedback when submission succeeds or fails

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: Separate components for:
  - Question set list display (QuestionSetList component)
  - Individual question set item (QuestionSetItem component)
  - Multi-step form container (MultiStepForm component)
  - Individual step display (FormStep component)
  - Step navigation controls (StepNavigation component)
  - Progress indicator (ProgressIndicator component)
  - Form retrieval logic (service/hook layer)
- **State Management**: Multi-step form state (current step, form data, validation state) should be managed in a centralized way using React hooks or state management patterns
- **Modular Design**: Form service integration should be abstracted into a reusable service or custom hook that can be used by other features
- **Dependency Management**: Question set list should not have tight coupling to form display logic; multi-step form should be reusable for different question sets
- **Clear Interfaces**: Define TypeScript interfaces for:
  - QuestionSet data structure
  - FormStep data structure
  - Form data and validation state
  - API responses

### Performance
- Question set list SHALL render within 200ms of component mount
- Form retrieval API calls SHALL have a timeout threshold of 30 seconds
- Step transitions SHALL complete within 100ms for smooth user experience
- List UI SHALL support lazy loading if the number of question sets exceeds 50 items (future-proofing)
- Component SHALL implement proper React memoization to prevent unnecessary re-renders
- Form data SHALL be persisted in memory during step navigation to avoid re-fetching

### Security
- Form service API calls SHALL include authentication tokens inherited from the shell application
- Question set data SHALL be validated against expected schema before display
- User SHALL only see question sets they are authorized to access (authorization handled by backend)
- Form submission data SHALL be sanitized and validated before transmission
- Sensitive form data SHALL not be logged or persisted in browser storage without encryption

### Reliability
- Failed form retrieval attempts SHALL allow retry without page refresh
- Component SHALL gracefully handle network failures and display user-friendly error messages
- System SHALL maintain question set list state even if individual form fetches fail
- Loading states SHALL prevent race conditions if user rapidly switches between forms
- Step navigation SHALL preserve all previously entered data even if user navigates away and returns
- Form submission SHALL implement retry logic with exponential backoff for transient failures

### Usability
- Question set names SHALL be displayed in clear, readable typography (following design system standards)
- Functional status indicators SHALL use accessible color contrast ratios (WCAG 2.1 AA compliance)
- Loading indicators SHALL be ARIA-labeled for screen reader accessibility
- Step indicators and progress bars SHALL be clearly visible and understandable
- Navigation buttons SHALL have clear, action-oriented labels (e.g., "Next", "Previous", "Submit")
- Multi-step forms SHALL support keyboard navigation (Tab, Enter, arrow keys where appropriate)
- Progress through steps SHALL be clearly communicated to users at all times
- Users SHALL be able to navigate back to previous steps without losing data
- Forms SHALL provide helpful guidance text for complex or ambiguous questions
- Error messages SHALL be descriptive and actionable (e.g., "Unable to load form. Please try again or contact support.")
- The UI SHALL be responsive and work on tablet-sized screens (768px width minimum)
- Keyboard navigation SHALL be fully supported (tab to navigate, enter to select)
