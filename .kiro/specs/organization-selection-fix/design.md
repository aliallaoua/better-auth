# Design Document

## Overview

The organization selection functionality in the OrganizationCard component has a state management issue where the `optimisticOrg` state becomes undefined after selecting an organization. This happens because the `setActiveOrganization` API call returns data that doesn't match the expected `ActiveOrganization` structure, causing the UI to lose the selected organization information.

The design focuses on fixing the state management flow, adding proper error handling, and ensuring data consistency between the API response and the component's expected data structure.

## Architecture

### Current Flow Issues
1. User clicks organization in dropdown → `setOptimisticOrg` called with temporary data
2. `setActiveOrganization` API called → returns data with different structure
3. `setOptimisticOrg` called again with API response → causes undefined state
4. Component re-renders with broken state

### Proposed Flow
1. User clicks organization in dropdown → Store previous state for rollback
2. `setOptimisticOrg` called with properly structured temporary data
3. `setActiveOrganization` API called with error handling
4. On success: Update state with validated API response
5. On error: Rollback to previous state and show error message

## Components and Interfaces

### State Management Structure
```typescript
interface OrganizationSelectionState {
  current: ActiveOrganization | null;
  previous: ActiveOrganization | null;
  isLoading: boolean;
  error: string | null;
}
```

### Data Validation
```typescript
interface ActiveOrganization {
  id: string;
  name: string;
  members: OrganizationMember[];
  invitations: OrganizationInvitation[];
  logo?: string;
  // other properties as needed
}
```

### API Response Handling
The `setActiveOrganization` function returns data from `authClient.organization.setActive()`. We need to:
1. Validate the response structure
2. Transform it to match `ActiveOrganization` interface if needed
3. Handle cases where required fields are missing

## Data Models

### Organization Selection Handler
```typescript
const handleOrganizationSelection = async (selectedOrg: any) => {
  // Store current state for rollback
  const previousState = optimisticOrg;
  
  // Set loading state and optimistic update
  setOptimisticOrg({
    id: selectedOrg.id,
    name: selectedOrg.name,
    members: selectedOrg.members || [],
    invitations: selectedOrg.invitations || [],
    logo: selectedOrg.logo,
  });
  
  try {
    const response = await setActiveOrganization({
      data: { id: selectedOrg.id }
    });
    
    // Validate and update with API response
    const validatedOrg = validateOrganizationData(response);
    setOptimisticOrg(validatedOrg);
    
  } catch (error) {
    // Rollback on error
    setOptimisticOrg(previousState);
    toast.error('Failed to switch organization');
  }
};
```

### Data Validation Function
```typescript
const validateOrganizationData = (data: any): ActiveOrganization => {
  return {
    id: data.id || data.organizationId,
    name: data.name || 'Unknown Organization',
    members: Array.isArray(data.members) ? data.members : [],
    invitations: Array.isArray(data.invitations) ? data.invitations : [],
    logo: data.logo,
    ...data // spread other properties
  };
};
```

## Error Handling

### API Error Scenarios
1. **Network Failure**: Rollback state, show network error message
2. **Invalid Response**: Use fallback data structure, log warning
3. **Missing Organization**: Rollback to previous state, show "Organization not found"
4. **Permission Denied**: Rollback state, show permission error

### State Consistency
- Always maintain a valid state structure
- Provide fallback values for missing required fields
- Use optimistic updates with rollback capability
- Validate data before updating state

## Testing Strategy

### Unit Tests
1. **Organization Selection Logic**
   - Test successful organization switching
   - Test error handling and rollback
   - Test data validation function
   - Test edge cases (null/undefined data)

2. **State Management**
   - Test optimistic updates
   - Test state rollback on errors
   - Test loading states
   - Test data structure consistency

3. **UI Behavior**
   - Test dropdown display with selected organization
   - Test fallback to "Personal" when no organization
   - Test error message display
   - Test loading indicators

### Integration Tests
1. **API Integration**
   - Test setActiveOrganization API calls
   - Test response handling
   - Test error scenarios
   - Test data transformation

2. **Component Integration**
   - Test organization switching flow
   - Test state persistence across re-renders
   - Test interaction with other components

### Error Scenarios Testing
1. Test network failures during organization switching
2. Test malformed API responses
3. Test missing organization data
4. Test concurrent organization switches
5. Test component unmounting during API calls

## Implementation Notes

### Key Changes Required
1. **Add proper error handling** in organization selection click handler
2. **Implement data validation** for API responses
3. **Add rollback mechanism** for failed organization switches
4. **Improve state structure** to handle loading and error states
5. **Add user feedback** for loading and error states

### Backward Compatibility
- Maintain existing prop interfaces
- Keep existing organization data structure
- Preserve current UI behavior for successful cases
- Add graceful degradation for edge cases