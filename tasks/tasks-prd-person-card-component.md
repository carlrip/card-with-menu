# Tasks: Person Card Web Component

Based on the PRD for the Person Card Web Component, here are the high-level tasks required for implementation:

## Tasks

- [x] 1.0 Create the core Person Card component structure

  - [x] 1.1 Create the PersonCard web component class extending HTMLElement
  - [x] 1.2 Set up Shadow DOM structure with proper encapsulation
  - [x] 1.3 Define the component's HTML template with person information display
  - [x] 1.4 Add properties/attributes for person data (name, role, status, email, dateJoined, location)
  - [x] 1.5 Implement the "View Profile" button with proper event handling
  - [x] 1.6 Add the menu button in the top-right corner
  - [x] 1.7 Set up lifecycle methods (connectedCallback, disconnectedCallback)
  - [x] 1.8 Register the custom element with the browser

- [x] 2.0 Implement the dropdown menu functionality

  - [x] 2.1 Create the dropdown menu HTML structure with menu items
  - [x] 2.2 Implement menu open/close state management
  - [x] 2.3 Add click event handlers for menu button and menu items
  - [x] 2.4 Implement menu item actions by dispatching custom events (Edit Profile, Send Message, Share Contact, Archive, Delete)
  - [x] 2.5 Add click outside detection to close menu
  - [x] 2.6 Implement proper focus management when menu opens/closes
  - [x] 2.7 Add visual feedback for menu interactions

- [x] 3.0 Add accessibility features and keyboard navigation

  - [x] 3.1 Add proper ARIA labels and roles for all interactive elements
  - [x] 3.2 Implement keyboard navigation for menu (arrow keys, Enter, Escape)
  - [x] 3.3 Add tabindex attributes for proper tab order
  - [x] 3.4 Implement screen reader announcements for dynamic content
  - [x] 3.5 Add semantic HTML structure for better accessibility
  - [x] 3.6 Test keyboard navigation flow and fix any issues
  - [x] 3.7 Add focus indicators and visual feedback for keyboard users

- [x] 4.0 Implement styling and visual design

  - [x] 4.1 Create CSS styles for the card layout with fixed dimensions
  - [x] 4.2 Style person information display with proper typography hierarchy
  - [x] 4.3 Style the "View Profile" button with prominent appearance
  - [x] 4.4 Style the menu button and dropdown menu
  - [x] 4.5 Add hover states and visual feedback for interactive elements
  - [x] 4.6 Implement status indicators (active/inactive/away)
  - [x] 4.7 Add subtle shadows and professional appearance
  - [x] 4.8 Ensure all styles are scoped within Shadow DOM
  - [x] 4.9 Clean up CSS using CSS variables for common colors and values

- [x] 5.0 Add data handling and display logic

  - [x] 5.1 Handle missing required fields (name, role) with fallback displays
  - [x] 5.2 Create fallback displays for missing optional information (email, dateJoined, location)
  - [x] 5.3 Implement date formatting for the dateJoined field
  - [x] 5.4 Add input sanitization to prevent XSS attacks when displaying user data
  - [x] 5.5 Create custom events for component interactions
  - [x] 5.6 Add graceful degradation for malformed or unexpected data

- [x] 6.0 Create comprehensive tests

  - [x] 6.1 Install and setup vitest and DOM testing library for use in tests with the DOM
  - [x] 6.2 Create a test npm script that executes vitest
  - [x] 6.3 Create a single simple test that expects true=true to verify the test runner is working ok
  - [x] 6.4 Create a single simple test using vitest and DOM testing library for component initialization and rendering. This will verify the test runner is working ok on components.
  - [x] 6.5 Write other unit tests using vitest and DOM testing library for component initialization and rendering
  - [x] 6.6 Test menu functionality and keyboard navigation using DOM testing library. Install and use the user-event (https://github.com/testing-library/user-event) package for simulating user interactions.
  - [x] 6.7 Test accessibility features and ARIA compliance with vitest
  - [x] 6.8 Test data handling and graceful degradation with DOM testing library

## Relevant Files

- `src/components/PersonCard.ts` - Main Person Card web component implementation
- `src/components/PersonCard.test.ts` - Unit tests for PersonCard component using vitest and DOM testing library
- `src/types/person.ts` - TypeScript interfaces for person data structure
- `src/types/person.test.ts` - Unit tests for person data types using vitest
- `src/utils/dateFormatter.ts` - Utility functions for date formatting
- `src/utils/dateFormatter.test.ts` - Unit tests for date formatting utilities using vitest
- `src/utils/validation.ts` - Data validation utilities
- `src/utils/validation.test.ts` - Unit tests for validation utilities using vitest
- `src/styles/personCard.css` - CSS styles for the Person Card component
- `demo/index.html` - Demo page showcasing the Person Card component
- `README.md` - Documentation for the Person Card component

### Notes

- The component will be implemented as a vanilla web component using Shadow DOM for style isolation
- All styling should be self-contained within the component using Shadow DOM
- The component should be compatible with all major browsers (Chrome, Firefox, Safari, Edge)
- Unit tests should be written using vitest and DOM testing library for web component testing
- The component should emit custom events for external applications to listen to (e.g., `person-card:profile-viewed`, `person-card:message-sent`)
- Focus management is critical for accessibility - ensure proper focus trapping and restoration
- Consider implementing a simple state machine for menu open/close states
- All interactive elements must be keyboard accessible and screen reader friendly
