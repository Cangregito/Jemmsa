# 📱 JEMMSA Mobile Testing Checklist

## Device Compatibility Testing

### iOS Devices (Safari)
- [ ] iPhone 14 Pro Max (6.7")
- [ ] iPhone 14 (6.1")
- [ ] iPhone SE (4.7")
- [ ] iPad Pro (12.9")

### Android Devices (Chrome)
- [ ] Samsung Galaxy S23 (6.1")
- [ ] Google Pixel 7a (6.1")
- [ ] OnePlus 11 (6.7")
- [ ] Samsung Galaxy Tab S8 (11")

### Chrome DevTools Emulation
- [ ] iPhone 12 Pro
- [ ] Pixel 5
- [ ] Samsung Galaxy S20

---

## Responsive Design Testing

### Breakpoints
- [ ] **320px** (Mobile small)
- [ ] **375px** (iPhone SE)
- [ ] **768px** (Tablet)
- [ ] **1024px** (Laptop)
- [ ] **1440px** (Desktop large)

### Layout Verification
- [ ] Navigation hamburger menu visible on mobile ✅
- [ ] Product cards stack vertically on mobile ✅
- [ ] Forms are touch-friendly (min 44px tap targets)
- [ ] Images scale properly without distortion ✅
- [ ] Text is readable without zooming ✅
- [ ] Modals/overlays don't exceed viewport ✅

---

## Touch Interaction Testing

### Button/Link Targets
- [ ] Minimum 44x44 px touch area ✅
- [ ] Adequate spacing between buttons (8px+ gap) ✅
- [ ] Hover effects work on touch (no :hover-only actions)
- [ ] Double-tap zoom disabled where needed

### Form Inputs
- [ ] Input fields are 44px tall minimum
- [ ] Keyboard type is correct (email, tel, text)
- [ ] No text-based zoom on input focus
- [ ] Form validation is clear

### Mobile Menu
- [ ] Hamburger menu opens/closes smoothly ✅
- [ ] Menu items are large enough to tap ✅
- [ ] Close button (X) is accessible ✅
- [ ] Escape key closes menu ✅

---

## Performance on Mobile

### Network Conditions
- [ ] Test on 4G (via DevTools throttling)
- [ ] Test on 3G (slow connection)
- [ ] Test on 2G (edge case)

### Load Times
- [ ] First Contentful Paint: < 3s
- [ ] Largest Contentful Paint: < 4s
- [ ] Time to Interactive: < 5s

### Image Loading
- [ ] Lazy loading works (scroll to load) ✅
- [ ] Images don't block page load ✅
- [ ] No layout shift during image load ✅

---

## Orientation Testing

### Portrait Mode
- [ ] All content visible without horizontal scroll ✅
- [ ] Touch targets remain accessible ✅
- [ ] Navigation is accessible ✅

### Landscape Mode
- [ ] Content adapts to narrow height ✅
- [ ] No content hidden or cropped ✅
- [ ] Keyboard input still works ✅

---

## Browser Compatibility

### Mobile Browsers
- [ ] Safari (iOS 15+)
- [ ] Chrome (Android)
- [ ] Firefox (Mobile)
- [ ] Samsung Internet
- [ ] Edge (Mobile)

### Feature Support
- [ ] CSS Grid works
- [ ] Flexbox works
- [ ] CSS Variables (dark mode) ✅
- [ ] Smooth scroll ✅
- [ ] localStorage ✅
- [ ] Loading attribute (lazy-loading) ✅

---

## Accessibility on Mobile

### Screen Reader Testing (iOS/Android)
- [ ] VoiceOver (iOS) works with page structure
- [ ] TalkBack (Android) navigates correctly
- [ ] Alt text is announced ✅
- [ ] Form labels are announced

### Keyboard Navigation
- [ ] Tab order is logical
- [ ] Focus visible at all times ✅
- [ ] Escape closes overlays ✅
- [ ] Can submit forms without mouse

### Color & Contrast
- [ ] No color-only information conveyance
- [ ] Contrast ratio >= 4.5:1 for text ✅
- [ ] Works in light and dark mode ✅

---

## Specific Page Testing

### 1. index.html (Homepage)
- [ ] Hero section displays correctly
- [ ] Product cards are responsive ✅
- [ ] Contact form is mobile-friendly ✅
- [ ] Testimonials carousel works
- [ ] CTA buttons are accessible ✅

### 2. catalogo.html (Catalog)
- [ ] Category filters fit on mobile
- [ ] Search bar is usable ✅
- [ ] Product grid adapts (2 cols on mobile, 3+ on desktop) ✅
- [ ] Infinite scroll or pagination works

### 3. producto.html (Product Detail)
- [ ] Image gallery works with touch
- [ ] Specifications are readable ✅
- [ ] Download buttons are accessible
- [ ] Breadcrumbs are visible ✅
- [ ] Return button works ✅

### 4. marcas.html (Brands)
- [ ] Brand cards stack vertically ✅
- [ ] Links open correctly ✅
- [ ] Images load properly ✅

### 5. 404.html (Error Page)
- [ ] Navigation links are accessible ✅
- [ ] Large text is readable ✅
- [ ] CTAs are clickable ✅

---

## Testing Tools

### Built-in DevTools
- [ ] Chrome DevTools Mobile Emulator
- [ ] Firefox Responsive Design Mode
- [ ] Safari Developer Tools

### Third-Party Tools
- [ ] Google PageSpeed Insights
- [ ] BrowserStack (real devices)
- [ ] Responsively App
- [ ] Android Emulator

### Lighthouse Audits
- [ ] Performance (target: > 80)
- [ ] Accessibility (target: > 90) ✅
- [ ] Best Practices (target: > 90) ✅
- [ ] SEO (target: > 90) ✅

---

## Known Issues & Fixes

| Device | Issue | Status | Fix |
|--------|-------|--------|-----|
| iPhone SE | Viewport width issue | ⏳ Monitoring | Font scaling |
| Samsung A10 | Slow load time | ⏳ Monitoring | Optimize images |
| iPad | Landscape menu | ✅ Fixed | Responsive menu |

---

## Sign-Off Checklist

- [ ] All breakpoints tested
- [ ] Touch interactions verified
- [ ] Performance acceptable
- [ ] Accessibility standards met
- [ ] No critical bugs found
- [ ] Ready for production

**Last Tested**: 2026-01-22
**Next Test Date**: 2026-02-22
**Tested By**: QA Team

