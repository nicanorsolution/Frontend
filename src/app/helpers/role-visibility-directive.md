# Role Visibility Directive

A powerful Angular directive that controls element visibility based on user roles and user types.

## Overview

The `appRoleVisibility` directive allows you to show or hide elements based on the current user's role and user type. This provides fine-grained control over UI elements based on authorization levels.

## Installation

The directive is already included in the `SharedModule` and can be used throughout the application.

## Basic Usage

```html
<!-- Show element only for specific roles -->
<div appRoleVisibility [requiredRoles]="[1, 9, 10]">
  <button>Admin Action</button>
</div>

<!-- Show element only for specific user types -->
<div appRoleVisibility [requiredUserTypes]="[1]">
  <p>Internal Users Only</p>
</div>

<!-- Combine role and user type requirements -->
<div appRoleVisibility [requiredRoles]="[1]" [requiredUserTypes]="[1, 2]">
  <button>Trade Initiator - All User Types</button>
</div>
```

## Properties

### `requiredRoles: number[]`
- **Type**: Array of numbers
- **Default**: `[]` (empty array means no role restrictions)
- **Description**: Array of role IDs that are allowed to see the element
- **Example**: `[1, 9, 10]` (TradeInitiator, Admin, SuperAdmin)

### `requiredUserTypes: number[]`
- **Type**: Array of numbers  
- **Default**: `[]` (empty array means no user type restrictions)
- **Description**: Array of user type IDs that are allowed to see the element
- **Example**: `[1, 2]` (InternalUser, ExternalUser)

### `hideMode: boolean`
- **Type**: Boolean
- **Default**: `false`
- **Description**: When `true`, hides the element when user has access (inverse behavior)
- **Example**: `[hideMode]="true"` - Hide element for specified roles

## Role Constants

Use the `UserRoleEnum` for better code readability:

```typescript
import { UserRoleEnum, UserType } from './helpers/UserRoleEnum';

// In your component
UserRoleEnum.TradeInitiator = 1
UserRoleEnum.Verifier = 2  
UserRoleEnum.TradeAuthorizer = 3
UserRoleEnum.TreasuryAuthorizer = 4
UserRoleEnum.TreasuryOperationAuthorizer = 5
UserRoleEnum.TradeOperationAuthorizer = 6
UserRoleEnum.TradeDeskAuthorizer = 7
UserRoleEnum.ViewOnly = 8
UserRoleEnum.Admin = 9
UserRoleEnum.SuperAdmin = 10

UserType.InternalUser = 1
UserType.ExternalUser = 2
```

## Examples

### 1. Navigation Menu Items

```html
<ul class="nav">
  <!-- Create Transaction - Only TradeInitiator -->
  <li appRoleVisibility [requiredRoles]="[1]">
    <a href="/create-transaction">New Transaction</a>
  </li>
  
  <!-- View Transactions - All roles -->
  <li appRoleVisibility [requiredRoles]="[1,2,3,4,5,6,7,8,9,10]">
    <a href="/view-transactions">View Transactions</a>
  </li>
  
  <!-- Admin Panel - Admins only, Internal users only -->
  <li appRoleVisibility [requiredRoles]="[9,10]" [requiredUserTypes]="[1]">
    <a href="/admin">Administration</a>
  </li>
</ul>
```

### 2. Form Sections

```html
<form>
  <!-- Basic fields - visible to all -->
  <div class="form-group">
    <label>Transaction Amount</label>
    <input type="number" class="form-control">
  </div>
  
  <!-- Approval section - only for authorizers -->
  <div class="form-group" appRoleVisibility [requiredRoles]="[3,4,5,6,7,9,10]">
    <label>Approval Status</label>
    <select class="form-control">
      <option>Pending</option>
      <option>Approved</option>
      <option>Rejected</option>
    </select>
  </div>
</form>
```

### 3. Table Actions

```html
<table class="table">
  <tbody>
    <tr *ngFor="let item of items">
      <td>{{ item.name }}</td>
      <td>
        <!-- Edit - TradeInitiator and Admins -->
        <button appRoleVisibility [requiredRoles]="[1,9,10]">Edit</button>
        
        <!-- Approve - Authorizers only -->
        <button appRoleVisibility [requiredRoles]="[3,4,5,6,7]">Approve</button>
        
        <!-- Delete - Admins only -->
        <button appRoleVisibility [requiredRoles]="[9,10]">Delete</button>
      </td>
    </tr>
  </tbody>
</table>
```

### 4. Hide Mode (Inverse Logic)

```html
<!-- Hide content FROM ViewOnly users -->
<div appRoleVisibility [requiredRoles]="[8]" [hideMode]="true">
  <button>This is hidden from ViewOnly users</button>
</div>

<!-- Show content TO ViewOnly users only -->
<div appRoleVisibility [requiredRoles]="[8]">
  <p>This message is only for ViewOnly users</p>
</div>
```

### 5. Dynamic Role Arrays

```typescript
// In your component
export class MyComponent {
  adminRoles = [9, 10];
  authorizerRoles = [3, 4, 5, 6, 7];
  internalUsersOnly = [1];
  
  getDynamicRoles(): number[] {
    // Complex logic to determine roles
    return [1, 9, 10];
  }
}
```

```html
<!-- Use component properties -->
<div appRoleVisibility [requiredRoles]="adminRoles" [requiredUserTypes]="internalUsersOnly">
  <h3>Admin Section</h3>
</div>

<!-- Use component methods -->
<div appRoleVisibility [requiredRoles]="getDynamicRoles()">
  <p>Dynamic content</p>
</div>
```

## Behavior Rules

1. **Both Conditions Must Be Met**: User must have BOTH required role AND required user type
2. **Empty Arrays = No Restrictions**: If `requiredRoles` or `requiredUserTypes` is empty, no restriction is applied for that property
3. **Unauthenticated Users**: If user is not authenticated (role/type is null), element is hidden
4. **Hide Mode**: When `hideMode="true"`, the logic is inverted

## Logic Flow

```
1. If no restrictions specified → Show element
2. If user not authenticated → Hide element  
3. Check if user role is in requiredRoles array
4. Check if user type is in requiredUserTypes array
5. If both checks pass → Show element (or hide if hideMode=true)
6. If either check fails → Hide element (or show if hideMode=true)
```

## Best Practices

1. **Use Enum Constants**: Always use `UserRoleEnum` and `UserType` enums instead of magic numbers
2. **Component Properties**: Define role arrays as component properties for reusability
3. **Combine with Route Guards**: Use directive for UI visibility, route guards for navigation protection
4. **Performance**: Avoid complex methods in template bindings; use component properties instead
5. **Accessibility**: Consider adding ARIA labels for screen readers when content is conditionally hidden

## Common Patterns

### Admin-Only Content
```html
<div appRoleVisibility [requiredRoles]="[9,10]">
  <!-- Admin content -->
</div>
```

### Internal Users Only
```html
<div appRoleVisibility [requiredUserTypes]="[1]">
  <!-- Internal user content -->
</div>
```

### Multiple Role Support
```html
<div appRoleVisibility [requiredRoles]="[1,2,3,4,5,6,7,8,9,10]">
  <!-- Content for all roles -->
</div>
```

### Exclusion Pattern
```html
<div appRoleVisibility [requiredRoles]="[8]" [hideMode]="true">
  <!-- Hidden from ViewOnly users -->
</div>
```
using SystemAdminitrationModule.Domain.DomainEvents;
using SystemAdminitrationModule.Domain.Enums;

namespace SystemAdminitrationModule.Domain.Entities;

public sealed class User : AggregateRoot<UserId>
{
    private readonly List<RoleId> _roleIds = new();
    
    private User() { } // EF Constructor
    
    private User(string firstName, string lastName, Email email, UserType userType) : base()
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        UserType = userType;
        IsActive = true;
        IsEmailVerified = false;
        FailedLoginAttempts = 0;
        
        RaiseDomainEvent(UserCreatedDomainEvent.Create(Id, email.Value));
    }
    
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public Email Email { get; private set; } = null!;
    public UserType UserType { get; private set; }
    public PasswordHash? PasswordHash { get; private set; }
    public bool IsActive { get; private set; }
    public bool IsEmailVerified { get; private set; }
    public bool IsLocked { get; private set; }
    public DateTime? LockedUntil { get; private set; }
    public int FailedLoginAttempts { get; private set; }
    public DateTime? LastLoginAt { get; private set; }
    public string? LastLoginIp { get; private set; }
    public bool MfaEnabled { get; private set; }
    public MfaType? MfaType { get; private set; }
    public string? MfaSecret { get; private set; }
    public IReadOnlyList<RoleId> RoleIds => _roleIds.AsReadOnly();
    
    public static User Create(string firstName, string lastName, string email, UserType userType)
    {
        Guard.Against.Empty(firstName);
        Guard.Against.Empty(lastName);
        
        var emailVO = Email.Create(email);
        return new User(firstName, lastName, emailVO, userType);
    }
    
    public void UpdateEmail(string email)
    {
        var newEmail = Email.Create(email);
        if (Email.Value == newEmail.Value) return;
        
        Email = newEmail;
        IsEmailVerified = false; // Require re-verification
        SetUpdatedAt();
        
        RaiseDomainEvent(UserEmailUpdatedDomainEvent.Create(Id, newEmail.Value));
    }
    
    public void SetPassword(string password, TimeSpan? expiry = null)
    {
        Guard.Against.Empty(password);
        
        PasswordHash = Domain.ValueObjects.PasswordHash.Create(password, expiry);
        SetUpdatedAt();
        
        RaiseDomainEvent(UserPasswordChangedDomainEvent.Create(Id));
    }
    
    public bool VerifyPassword(string password)
    {
        return PasswordHash?.Verify(password) ?? false;
    }
    
    public void VerifyEmail()
    {
        if (IsEmailVerified) return;
        
        IsEmailVerified = true;
        SetUpdatedAt();
        
        RaiseDomainEvent(UserEmailVerifiedDomainEvent.Create(Id));
    }
    
    public void LockAccount(TimeSpan? lockDuration = null)
    {
        IsLocked = true;
        LockedUntil = lockDuration.HasValue ? DateTime.UtcNow.Add(lockDuration.Value) : null;
        SetUpdatedAt();
        
        RaiseDomainEvent(UserAccountLockedDomainEvent.Create(Id, LockedUntil));
    }
    
    public void UnlockAccount()
    {
        if (!IsLocked) return;
        
        IsLocked = false;
        LockedUntil = null;
        FailedLoginAttempts = 0;
        SetUpdatedAt();
        
        RaiseDomainEvent(UserAccountUnlockedDomainEvent.Create(Id));
    }
    
    public void RecordFailedLogin(string ipAddress)
    {
        Guard.Against.Empty(ipAddress);
        
        FailedLoginAttempts++;
        SetUpdatedAt();
        
        // Auto-lock after 5 failed attempts
        if (FailedLoginAttempts >= 5)
        {
            LockAccount(TimeSpan.FromMinutes(30));
        }
        
        RaiseDomainEvent(UserLoginFailedDomainEvent.Create(Id, ipAddress, FailedLoginAttempts));
    }
    
    public void RecordSuccessfulLogin(string ipAddress)
    {
        Guard.Against.Empty(ipAddress);
        
        FailedLoginAttempts = 0;
        LastLoginAt = DateTime.UtcNow;
        LastLoginIp = ipAddress;
        SetUpdatedAt();
        
        RaiseDomainEvent(UserLoginSuccessfulDomainEvent.Create(Id, ipAddress));
    }
    
    public void EnableMfa(MfaType mfaType, string? secret = null)
    {
        MfaEnabled = true;
        MfaType = mfaType;
        MfaSecret = secret;
        SetUpdatedAt();
        
        RaiseDomainEvent(UserMfaEnabledDomainEvent.Create(Id, mfaType));
    }
    
    public void DisableMfa()
    {
        if (!MfaEnabled) return;
        
        MfaEnabled = false;
        MfaType = null;
        MfaSecret = null;
        SetUpdatedAt();
        
        RaiseDomainEvent(UserMfaDisabledDomainEvent.Create(Id));
    }
    
    public void AssignRole(RoleId roleId)
    {
        Guard.Against.Null(roleId);
        
        if (_roleIds.Contains(roleId)) return;
        
        _roleIds.Add(roleId);
        SetUpdatedAt();
        
        RaiseDomainEvent(UserRoleAssignedDomainEvent.Create(Id, roleId));
    }
    
    public void RemoveRole(RoleId roleId)
    {
        Guard.Against.Null(roleId);
        
        if (_roleIds.Remove(roleId))
        {
            SetUpdatedAt();
            RaiseDomainEvent(UserRoleRemovedDomainEvent.Create(Id, roleId));
        }
    }
    
    public void Deactivate()
    {
        if (!IsActive) return;
        
        IsActive = false;
        SetUpdatedAt();
        
        RaiseDomainEvent(UserDeactivatedDomainEvent.Create(Id));
    }
    
    public void Activate()
    {
        if (IsActive) return;
        
        IsActive = true;
        SetUpdatedAt();
        
        RaiseDomainEvent(UserActivatedDomainEvent.Create(Id));
    }
    
    public bool IsAccountLocked => IsLocked && (LockedUntil == null || DateTime.UtcNow < LockedUntil);
    public bool IsPasswordExpired => PasswordHash?.IsExpired ?? false;
}
