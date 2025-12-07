# 🎨 Easy11 Design System
## Customer Website Design Guidelines

---

## 🎨 Brand Identity

### Tagline
"Shop Smarter. Personalized by AI. Trusted by You."

### Brand Values
- **Smart:** AI-powered, intelligent recommendations
- **Trusted:** Secure, reliable, transparent
- **Modern:** Clean, fast, beautiful design
- **Accessible:** Inclusive for all users

---

## 🌈 Color Palette

### Primary Colors

```css
--color-navy: #000154;      /* Primary brand color */
--color-blue: #1A58D3;      /* Interactive elements */
--color-sky: #52D5FF;       /* Accents, highlights */
--color-teal: #31EE88;      /* Success, CTAs */
--color-white: #FFFFFF;     /* Backgrounds */
```

### Semantic Colors

```css
/* Success */
--color-success: #31EE88;
--color-success-hover: #28D077;
--color-success-light: #E8FFF3;

/* Error */
--color-error: #FF4444;
--color-error-hover: #E63333;
--color-error-light: #FFE8E8;

/* Warning */
--color-warning: #FFA726;
--color-warning-hover: #FF9800;
--color-warning-light: #FFF3E0;

/* Info */
--color-info: #52D5FF;
--color-info-hover: #42C5EF;
--color-info-light: #E0F7FF;
```

### Neutral Colors

```css
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
```

---

## 📝 Typography

### Font Families

```css
--font-heading: 'Poppins', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'Fira Code', monospace;
```

### Font Sizes

```css
/* Headings */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights

```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

---

## 📐 Spacing System

### Base Unit: 4px

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 🎭 Components

### Buttons

#### Primary Button
```tsx
<button className="
  px-6 py-3 
  bg-blue-600 hover:bg-blue-700
  text-white font-semibold
  rounded-lg
  transition-all duration-200
  shadow-md hover:shadow-lg
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
">
  Primary Action
</button>
```

#### Secondary Button
```tsx
<button className="
  px-6 py-3
  bg-white hover:bg-gray-50
  text-blue-600 font-semibold
  border-2 border-blue-600
  rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
">
  Secondary Action
</button>
```

#### Ghost Button
```tsx
<button className="
  px-6 py-3
  bg-transparent hover:bg-gray-100
  text-gray-700 font-semibold
  rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
">
  Ghost Action
</button>
```

#### Success Button
```tsx
<button className="
  px-6 py-3
  bg-teal-500 hover:bg-teal-600
  text-white font-semibold
  rounded-lg
  transition-all duration-200
  shadow-md hover:shadow-lg
  focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
">
  Success Action
</button>
```

### Cards

```tsx
<div className="
  bg-white
  rounded-xl
  shadow-md hover:shadow-xl
  transition-shadow duration-300
  overflow-hidden
  border border-gray-100
">
  {/* Card content */}
</div>
```

### Input Fields

```tsx
<input className="
  w-full px-4 py-3
  border-2 border-gray-300
  rounded-lg
  focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
  transition-all duration-200
  placeholder-gray-400
" />
```

### Badges

```tsx
{/* Success Badge */}
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-sm font-medium
  bg-teal-100 text-teal-800
">
  In Stock
</span>

{/* Warning Badge */}
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-sm font-medium
  bg-orange-100 text-orange-800
">
  Low Stock
</span>

{/* Error Badge */}
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-sm font-medium
  bg-red-100 text-red-800
">
  Out of Stock
</span>
```

---

## 🎬 Animations

### Transitions

```css
/* Fast */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Normal */
--transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Slow */
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Animations

```tsx
// Fade In
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

// Slide Up
const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4 }
};

// Scale In
const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3 }
};
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
--screen-sm: 640px;   /* Small devices */
--screen-md: 768px;   /* Medium devices */
--screen-lg: 1024px;  /* Large devices */
--screen-xl: 1280px;  /* Extra large devices */
--screen-2xl: 1536px; /* 2X Extra large */
```

### Usage in Tailwind

```tsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-4
">
  {/* Responsive grid */}
</div>
```

---

## ♿ Accessibility

### Focus States
All interactive elements must have visible focus states:
```css
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

### Color Contrast
- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Large text minimum: 3:1
- Enhanced: 7:1 (WCAG AAA)

### ARIA Labels
```tsx
<button aria-label="Close modal">
  <CloseIcon />
</button>

<input aria-label="Search products" />
```

### Keyboard Navigation
- Tab order follows visual order
- All interactive elements keyboard accessible
- Skip links for main content
- Escape key closes modals/drawers

---

## 🌓 Dark Mode

### Color Adjustments

```css
/* Light Mode (Default) */
.light {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --text-primary: #111827;
  --text-secondary: #6B7280;
}

/* Dark Mode */
.dark {
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
}
```

---

## 📋 Component Checklist

Before creating a new component, ensure:

- [ ] Follows design system colors
- [ ] Uses system typography
- [ ] Implements proper spacing
- [ ] Includes hover/active states
- [ ] Has focus indicators
- [ ] Responsive across breakpoints
- [ ] Accessible (ARIA, keyboard)
- [ ] Includes loading states
- [ ] Has error states
- [ ] Documented with examples

---

## 🎯 Implementation Priority

### Phase 1: Foundation
1. Color system setup
2. Typography configuration
3. Spacing utilities
4. Base component library

### Phase 2: Components
1. Buttons (all variants)
2. Form inputs
3. Cards
4. Modals
5. Navigation

### Phase 3: Patterns
1. Product cards
2. Category grids
3. Search interfaces
4. Cart components
5. Checkout forms

---

**Next Steps:** 
1. Implement design tokens in TailwindCSS config
2. Create base component library
3. Build Storybook for component documentation

