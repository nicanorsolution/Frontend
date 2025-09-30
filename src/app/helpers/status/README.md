# Status Component

A clean, minimalistic status component to replace PrimeNG's `<p-tag>` with subtle styling and smooth interactions.

## Usage

Import the `SharedModule` in your module to use the status component:

```typescript
import { SharedModule } from '../helpers/share.module';

@NgModule({
  imports: [SharedModule],
  // ...
})
```

Then use in your template:

```html
<status value="Published" severity="success"></status>
<status value="Pending" severity="warning" size="large"></status>
<status value="Draft" severity="secondary"></status>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | The text to display in the status tag |
| `severity` | `StatusSeverity \| string` | `'primary'` | The color theme of the status tag |
| `icon` | `string` | `undefined` | Optional icon class (e.g., PrimeIcons) |
| `rounded` | `boolean` | `true` | Whether to use rounded corners |
| `size` | `'small' \| 'normal' \| 'large'` | `'normal'` | Size variant of the status tag |

## Severity Options

- `primary` - Blue theme (default)
- `success` - Green theme for successful/published states
- `warning` - Orange/Yellow theme for pending/warnings
- `danger` - Red theme for errors or rejected states
- `info` - Cyan theme for informational states
- `secondary` - Gray theme for draft/inactive states

## Design Philosophy

This component follows a **clean, minimalistic design** with:
- Thin borders with subtle background tints
- Clean typography with proper spacing
- Gentle hover effects with slight elevation
- Consistent color palette across all severity levels
- Mobile-responsive sizing

## Examples

### Basic Usage
```html
<status value="Approved" severity="success"></status>
<status value="Under Review" severity="info"></status>
<status value="Needs Attention" severity="warning"></status>
```

### Different Sizes
```html
<status value="Small" severity="primary" size="small"></status>
<status value="Normal" severity="success" size="normal"></status>
<status value="Large" severity="info" size="large"></status>
```

### Common Use Cases
```html
<!-- Document Status -->
<status value="Published" severity="success"></status>
<status value="Draft" severity="secondary"></status>
<status value="Pending Review" severity="warning"></status>

<!-- User Status -->
<status value="Active" severity="success"></status>
<status value="Inactive" severity="secondary"></status>
<status value="Blocked" severity="danger"></status>
```

### Migration from p-tag
Replace this:
```html
<p-tag [value]="status" [severity]="colorStatus(item.status)"></p-tag>
```

With this:
```html
<status [value]="status" [severity]="colorStatus(item.status)"></status>
```

## Features

- 🎨 **Clean Design** - Minimalistic with subtle borders and backgrounds
- 📱 **Responsive** - Adapts to different screen sizes
- 🔄 **Smooth Animations** - Gentle fade-in and hover effects
- 🎯 **Consistent** - Unified styling across all severity levels
- 🚀 **Lightweight** - Minimal CSS footprint
- 🔧 **Flexible** - Multiple size variants and easy customization
- ♿ **Accessible** - Proper contrast ratios and semantic markup

## Styling

The component uses a light, airy design with:
- 5% opacity background tints for subtle color indication
- Clean borders matching the text color
- Gentle hover effects with 10% background opacity
- Consistent padding and typography scaling
- Smooth transitions for all interactive states
