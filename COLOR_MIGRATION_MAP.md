# Color Migration Map - Old to New

## Color Replacements

### Old → New Mapping

**Charcoal (Dark Text/Backgrounds) → Primary/Secondary**
- `text-charcoal` → `text-secondary-900`
- `bg-charcoal` → `bg-primary-900`
- `text-charcoal/80` → `text-secondary-800`
- `text-charcoal/70` → `text-secondary-700`
- `text-charcoal/60` → `text-secondary-600`
- `border-charcoal` → `border-secondary-700`

**Chestnut (Brand/Accent) → Accent**
- `text-chestnut` → `text-accent`
- `bg-chestnut` → `bg-accent`
- `border-chestnut` → `border-accent-600`
- `hover:bg-chestnut` → `hover:bg-accent-600`
- `from-chestnut` → `from-accent`
- `to-chestnut` → `to-accent`

**Bone (Light Backgrounds) → Secondary Light**
- `bg-bone` → `bg-secondary-50`
- `text-bone` → `text-white`

**Khaki (Muted) → Secondary Mid**
- `bg-khaki` → `bg-secondary-200`
- `text-khaki` → `text-secondary-500`
- `border-khaki` → `border-secondary-300`

**Gradients**
- `bg-gradient-chestnut` → `bg-gradient-brand` or `bg-gradient-accent`
- `bg-gradient-brand` → `bg-gradient-primary` (updated in tailwind)

## Semantic Color Usage

### Buttons & CTAs
- **Primary CTA**: `bg-accent hover:bg-accent-600 text-white`
- **Secondary CTA**: `bg-secondary-100 hover:bg-secondary-200 text-secondary-900`
- **Danger**: `bg-red-600 hover:bg-red-700 text-white`
- **Success**: `bg-success hover:bg-success-600 text-white`

### Text Hierarchy
- **Headings**: `text-primary-900` or `text-secondary-900`
- **Body**: `text-secondary-700`
- **Muted**: `text-secondary-500`
- **Light**: `text-secondary-400`

### Backgrounds
- **Page**: `bg-white` or `bg-secondary-50`
- **Cards**: `bg-white` with `border-secondary-200`
- **Sections**: `bg-secondary-50`
- **Header/Footer**: `bg-primary-900 text-white`

### Links
- **Default**: `text-accent hover:text-accent-700`
- **Visited**: `text-accent-800`

### Status Colors
- **Success**: `text-success-600 bg-success-50`
- **Warning**: `text-warning-600 bg-warning-50`
- **Error**: `text-red-600 bg-red-50`
- **Info**: `text-accent-600 bg-accent-50`
