# Requirements Document

## Introduction

This feature addresses the organization selection functionality in the OrganizationCard component. Currently, when users select an organization from the dropdown menu, the selected organization name becomes undefined after the initial selection, causing display issues. The feature will ensure that organization selection works reliably and maintains the selected organization state properly.

## Requirements

### Requirement 1

**User Story:** As a user, I want to select an organization from the dropdown menu, so that I can switch between different organizations and see the selected organization displayed correctly.

#### Acceptance Criteria

1. WHEN a user clicks on an organization in the dropdown menu THEN the system SHALL update the active organization state
2. WHEN the active organization is updated THEN the system SHALL display the selected organization name in the dropdown trigger
3. WHEN the organization selection is successful THEN the system SHALL persist the selection across component re-renders
4. WHEN the setActiveOrganization API call completes THEN the system SHALL update the optimisticOrg state with the correct data structure

### Requirement 2

**User Story:** As a user, I want the organization dropdown to show the currently selected organization, so that I can easily identify which organization is active.

#### Acceptance Criteria

1. WHEN the component loads THEN the system SHALL display the current active organization name in the dropdown trigger
2. WHEN no organization is selected THEN the system SHALL display "Personal" as the default option
3. WHEN the organization state changes THEN the system SHALL immediately reflect the change in the UI
4. WHEN the optimisticOrg state becomes undefined THEN the system SHALL fallback to displaying "Personal"

### Requirement 3

**User Story:** As a developer, I want proper error handling for organization selection, so that users receive feedback when organization switching fails.

#### Acceptance Criteria

1. WHEN the setActiveOrganization API call fails THEN the system SHALL revert the optimisticOrg state to the previous value
2. WHEN an API error occurs THEN the system SHALL display an appropriate error message to the user
3. WHEN the organization data structure is invalid THEN the system SHALL handle it gracefully without breaking the UI
4. WHEN network issues prevent organization switching THEN the system SHALL maintain the current organization state

### Requirement 4

**User Story:** As a user, I want consistent organization data structure, so that all organization-related features work reliably.

#### Acceptance Criteria

1. WHEN organization data is received from the API THEN the system SHALL ensure it contains all required fields (id, name, members, invitations)
2. WHEN setting optimistic state THEN the system SHALL validate the data structure before updating
3. WHEN organization data is missing required fields THEN the system SHALL provide default values or handle gracefully
4. WHEN displaying organization information THEN the system SHALL use consistent data access patterns