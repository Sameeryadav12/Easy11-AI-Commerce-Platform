# 📋 Step-by-Step Testing Guide - Easy11 E-Commerce Platform

**Purpose**: Complete testing guide for making the platform production-ready  
**Target**: E-Commerce Website (Customer Portal)  
**Status**: Ready for Testing

---

## 🎯 Pre-Testing Setup

### Step 1: Start All Services

**Backend API** (Port 5000):
```powershell
cd backend
npm install
npm run dev
```

**Frontend** (Port 3000):
```powershell
cd apps/web/frontend
npm install
npm run dev
```

**Database** (PostgreSQL):
- Ensure PostgreSQL is running
- Database should be created and migrated
- Run: `cd backend && npx prisma migrate dev`

**Redis** (Optional for caching):
- Ensure Redis is running if using caching

### Step 2: Verify Services Are Running

1. **Backend Health Check**: Open `http://localhost:5000/health`
   - Should return: `{"status":"healthy",...}`

2. **Frontend**: Open `http://localhost:3000`
   - Should load the homepage

3. **Check Browser Console**: Open DevTools (F12)
   - Should have no critical errors

---

## 🧪 PART 1: AUTHENTICATION & USER MANAGEMENT

### Test 1.1: User Registration

**Steps**:
1. Navigate to `http://localhost:3000/auth/register`
2. Fill in the registration form:
   - **Name**: "Test User"
   - **Email**: "test@example.com" (use a unique email each time)
   - **Password**: "TestPassword123!" (must be 8+ characters)
   - **Confirm Password**: "TestPassword123!"
   - **Check**: Agree to Terms checkbox
3. Click "Create Account"
4. **Expected**: 
   - ✅ Success toast message
   - ✅ Redirect to `/account` dashboard
   - ✅ User logged in automatically

**Test Cases**:
- [ ] **Valid Registration**: Complete form with valid data
- [ ] **Duplicate Email**: Try registering with existing email
  - Expected: Error message (generic, no enumeration)
- [ ] **Weak Password**: Try password less than 8 characters
  - Expected: Validation error
- [ ] **Password Mismatch**: Confirm password doesn't match
  - Expected: Validation error
- [ ] **Missing Fields**: Submit with empty fields
  - Expected: Field-specific validation errors
- [ ] **Invalid Email**: Use invalid email format
  - Expected: Email validation error

**What to Check**:
- ✅ Form validation works
- ✅ Password strength indicator shows
- ✅ Error messages are clear
- ✅ Success redirect works
- ✅ User is logged in after registration

---

### Test 1.2: User Login

**Steps**:
1. Navigate to `http://localhost:3000/auth/login`
2. Enter credentials:
   - **Email**: Use email from Test 1.1
   - **Password**: Use password from Test 1.1
3. Optionally check "Remember me"
4. Click "Sign In"
5. **Expected**:
   - ✅ Success toast with welcome message
   - ✅ Redirect to `/account` or intended page
   - ✅ User session active

**Test Cases**:
- [ ] **Valid Login**: Correct email and password
- [ ] **Invalid Email**: Wrong email format
  - Expected: Generic error message
- [ ] **Invalid Password**: Wrong password
  - Expected: Generic error (no user enumeration)
- [ ] **Empty Fields**: Submit with empty fields
  - Expected: Field validation errors
- [ ] **Rate Limiting**: Try 6+ failed login attempts
  - Expected: Rate limit message after 5 attempts

**What to Check**:
- ✅ Login form works
- ✅ Error handling is generic (security)
- ✅ Redirect works correctly
- ✅ Session persists after page refresh
- ✅ "Remember me" functionality (if implemented)

---

### Test 1.3: Password Reset Flow

**Steps**:
1. Navigate to `http://localhost:3000/auth/forgot-password`
2. Enter registered email address
3. Click "Send Reset Link"
4. **Expected**:
   - ✅ Success message (generic)
   - ✅ Email sent (check backend logs or email service)

**Test Cases**:
- [ ] **Valid Email**: Registered email
- [ ] **Invalid Email**: Non-existent email
  - Expected: Generic success message (no enumeration)
- [ ] **Email Format**: Invalid email format
  - Expected: Validation error

**What to Check**:
- ✅ Reset email is sent
- ✅ Reset link works (if email service configured)
- ✅ Password can be changed via reset link

---

### Test 1.4: Logout

**Steps**:
1. While logged in, click user menu/avatar
2. Click "Logout" or navigate to logout endpoint
3. **Expected**:
   - ✅ User logged out
   - ✅ Redirect to homepage or login
   - ✅ Session cleared

**What to Check**:
- ✅ Logout works
- ✅ Session is cleared
- ✅ Protected routes require login after logout

---

## 🏠 PART 2: HOMEPAGE & NAVIGATION

### Test 2.1: Homepage Load

**Steps**:
1. Navigate to `http://localhost:3000/`
2. Check page loads completely
3. Scroll through all sections

**Expected**:
- ✅ Page loads without errors
- ✅ All sections render
- ✅ No console errors
- ✅ Images load
- ✅ Animations work smoothly

**Sections to Verify**:
- [ ] **Hero Section**: Main banner/carousel
- [ ] **Featured Categories**: Category cards/links
- [ ] **Trending Products**: Product grid
- [ ] **Personalized Recommendations**: AI recommendations (if logged in)
- [ ] **Why Choose Us**: Benefits section
- [ ] **Testimonials**: Customer reviews
- [ ] **Newsletter CTA**: Email signup
- [ ] **Footer**: Links and information

**What to Check**:
- ✅ All sections visible
- ✅ Links work
- ✅ Images load
- ✅ Responsive on mobile
- ✅ No broken elements

---

### Test 2.2: Navigation

**Steps**:
1. Test all navigation links
2. Test mobile menu (resize browser)
3. Test search functionality
4. Test cart icon
5. Test user menu (if logged in)

**Navigation Links to Test**:
- [ ] **Home**: `/`
- [ ] **Products**: `/products`
- [ ] **Categories**: Various category links
- [ ] **About**: `/about`
- [ ] **Contact**: `/contact`
- [ ] **FAQ**: `/faq`

**What to Check**:
- ✅ All links navigate correctly
- ✅ Active link highlighting
- ✅ Mobile menu toggles
- ✅ Search bar opens/closes
- ✅ Cart drawer opens
- ✅ User menu works

---

## 🛍️ PART 3: PRODUCT CATALOG & SEARCH

### Test 3.1: Product Listing Page

**Steps**:
1. Navigate to `http://localhost:3000/products`
2. Check products display
3. Test pagination
4. Test filters
5. Test sorting

**Expected**:
- ✅ Products load
- ✅ Grid/list view works
- ✅ Pagination works
- ✅ Filters apply
- ✅ Sorting works

**Test Cases**:
- [ ] **Initial Load**: Products display correctly
- [ ] **Pagination**: Click next/previous pages
- [ ] **Category Filter**: Filter by category
- [ ] **Price Filter**: Set min/max price
- [ ] **Rating Filter**: Filter by minimum rating
- [ ] **Stock Filter**: Show only in-stock items
- [ ] **Sort Options**: 
  - Price: Low to High
  - Price: High to Low
  - Rating: Highest First
  - Newest First
  - Trending
- [ ] **View Modes**: Switch between grid and list
- [ ] **AI Sort**: Toggle AI-powered sorting

**What to Check**:
- ✅ Products load quickly
- ✅ Filters work correctly
- ✅ Sorting is accurate
- ✅ Pagination updates URL
- ✅ Loading states show
- ✅ Empty states show when no results

---

### Test 3.2: Product Search

**Steps**:
1. Use search bar in header
2. Type a product name
3. Check autocomplete suggestions
4. Submit search
5. Check results page

**Test Cases**:
- [ ] **Autocomplete**: Type "headphone"
  - Expected: Suggestions appear
- [ ] **Search Results**: Submit search
  - Expected: Results page shows matching products
- [ ] **Empty Results**: Search for "xyz123"
  - Expected: Empty state message
- [ ] **Clear Search**: Click clear button
  - Expected: Return to all products

**What to Check**:
- ✅ Autocomplete is fast (< 100ms)
- ✅ Suggestions are relevant
- ✅ Search results are accurate
- ✅ Search query appears in URL
- ✅ Results page has clear search indicator

---

### Test 3.3: Product Detail Page

**Steps**:
1. Click on any product from listing
2. Navigate to product detail page
3. Check all product information
4. Test add to cart
5. Test wishlist toggle
6. Test image gallery

**Expected**:
- ✅ Product details display correctly
- ✅ Images load and can be viewed
- ✅ Add to cart works
- ✅ Wishlist toggle works
- ✅ Related products show

**Test Cases**:
- [ ] **Product Info**: All details visible
  - Name, price, description, specs
- [ ] **Image Gallery**: Click through images
  - Expected: Images change, zoom works
- [ ] **Add to Cart**: Click "Add to Cart"
  - Expected: Item added, cart count updates, toast notification
- [ ] **Wishlist**: Toggle wishlist heart icon
  - Expected: Item saved/removed from wishlist
- [ ] **Quantity**: Change quantity selector
  - Expected: Quantity updates
- [ ] **Related Products**: Scroll to related section
  - Expected: Similar products show

**What to Check**:
- ✅ All product data displays
- ✅ Images are high quality
- ✅ Add to cart updates cart
- ✅ Wishlist persists
- ✅ Page is responsive
- ✅ Share functionality works (if implemented)

---

## 🛒 PART 4: SHOPPING CART

### Test 4.1: Add to Cart

**Steps**:
1. Add product from listing page
2. Add product from detail page
3. Add multiple quantities
4. Check cart drawer/count

**Expected**:
- ✅ Items added to cart
- ✅ Cart count updates
- ✅ Cart drawer opens (if implemented)
- ✅ Toast notification shows

**Test Cases**:
- [ ] **From Listing**: Add from product grid
- [ ] **From Detail**: Add from product page
- [ ] **Multiple Items**: Add different products
- [ ] **Quantity**: Add multiple quantities of same item
- [ ] **Cart Persistence**: Refresh page, cart should persist

**What to Check**:
- ✅ Cart count updates immediately
- ✅ Cart drawer/sidebar opens
- ✅ Items appear in cart
- ✅ Cart persists in localStorage
- ✅ Toast notifications work

---

### Test 4.2: Cart Management

**Steps**:
1. Navigate to `/cart` or open cart drawer
2. View cart items
3. Update quantities
4. Remove items
5. Apply coupon (if available)
6. Check totals

**Expected**:
- ✅ Cart page loads
- ✅ All items display
- ✅ Quantity updates work
- ✅ Remove works
- ✅ Totals calculate correctly

**Test Cases**:
- [ ] **View Cart**: Open cart page
- [ ] **Update Quantity**: Increase/decrease quantity
  - Expected: Subtotal updates, total recalculates
- [ ] **Remove Item**: Click remove/delete
  - Expected: Item removed, cart updates
- [ ] **Empty Cart**: Remove all items
  - Expected: Empty cart message shows
- [ ] **Coupon Code**: Enter coupon (if available)
  - Expected: Discount applies, total updates
- [ ] **Shipping Calculation**: Change shipping method
  - Expected: Total updates with shipping

**What to Check**:
- ✅ Cart displays correctly
- ✅ Quantities can be updated
- ✅ Remove works
- ✅ Totals are accurate
- ✅ Cart persists
- ✅ Proceed to checkout button works

---

## 💳 PART 5: CHECKOUT PROCESS

### Test 5.1: Checkout Flow

**Steps**:
1. Add items to cart
2. Navigate to `/checkout`
3. Fill shipping address
4. Select shipping method
5. Enter payment information
6. Review order
7. Submit order

**Expected**:
- ✅ Checkout page loads
- ✅ Form validation works
- ✅ Address can be saved
- ✅ Payment processes
- ✅ Order is created
- ✅ Confirmation shown

**Test Cases**:
- [ ] **Guest Checkout**: Checkout without login
  - Expected: Can enter email, proceed
- [ ] **Logged-in Checkout**: Checkout while logged in
  - Expected: Saved addresses available
- [ ] **Shipping Address**: Fill address form
  - Expected: Validation works, address saves
- [ ] **Shipping Method**: Select shipping option
  - Expected: Total updates with shipping cost
- [ ] **Payment**: Enter payment details
  - Expected: Payment form validates
- [ ] **Order Review**: Check order summary
  - Expected: All items, totals correct
- [ ] **Submit Order**: Complete checkout
  - Expected: Order created, redirect to confirmation

**What to Check**:
- ✅ All form fields work
- ✅ Validation is accurate
- ✅ Address autocomplete works (if implemented)
- ✅ Payment processing works
- ✅ Order summary is correct
- ✅ Order confirmation shows

---

### Test 5.2: Order Confirmation

**Steps**:
1. Complete checkout
2. Navigate to confirmation page
3. Check order details
4. Test order tracking

**Expected**:
- ✅ Confirmation page shows
- ✅ Order details are correct
- ✅ Order number displayed
- ✅ Email sent (check backend)
- ✅ Tracking link works

**What to Check**:
- ✅ Order number is visible
- ✅ All items listed correctly
- ✅ Totals match
- ✅ Shipping address correct
- ✅ Tracking number shows (if available)
- ✅ "View Order" link works

---

## 👤 PART 6: USER ACCOUNT PAGES

### Test 6.1: Account Dashboard

**Steps**:
1. Login to account
2. Navigate to `/account`
3. Check dashboard loads
4. Verify user information
5. Test quick actions

**Expected**:
- ✅ Dashboard loads
- ✅ User info displays
- ✅ Recent orders show
- ✅ Quick stats visible
- ✅ Navigation works

**What to Check**:
- ✅ Welcome message with user name
- ✅ Recent orders list
- ✅ Quick stats (orders, points, etc.)
- ✅ Quick action buttons
- ✅ Navigation sidebar works

---

### Test 6.2: Order History

**Steps**:
1. Navigate to `/account/orders`
2. Check orders list
3. Click on order details
4. Test order status
5. Test reorder (if available)

**Expected**:
- ✅ Orders display
- ✅ Order details accessible
- ✅ Status updates show
- ✅ Reorder works (if implemented)

**Test Cases**:
- [ ] **Orders List**: All orders visible
- [ ] **Order Details**: Click order to see details
- [ ] **Order Status**: Status is accurate
- [ ] **Filter Orders**: Filter by status/date
- [ ] **Reorder**: Reorder previous order

**What to Check**:
- ✅ Orders are sorted correctly
- ✅ Order details are complete
- ✅ Status badges are accurate
- ✅ Reorder adds items to cart
- ✅ Tracking links work

---

### Test 6.3: Wishlist

**Steps**:
1. Navigate to `/account/wishlist`
2. Check saved items
3. Add item to cart from wishlist
4. Remove from wishlist
5. Test sharing (if available)

**Expected**:
- ✅ Wishlist loads
- ✅ Items display
- ✅ Add to cart works
- ✅ Remove works
- ✅ Share works (if implemented)

**What to Check**:
- ✅ All wishlist items show
- ✅ Add to cart from wishlist works
- ✅ Remove updates list
- ✅ Empty wishlist message shows
- ✅ Share functionality works

---

### Test 6.4: Account Settings

**Steps**:
1. Navigate to `/account/security`
2. Update password
3. Navigate to `/account/addresses`
4. Add/edit address
5. Navigate to `/account/payments`
6. Add payment method

**Expected**:
- ✅ Security settings work
- ✅ Password update works
- ✅ Address management works
- ✅ Payment methods save
- ✅ Changes persist

**Test Cases**:
- [ ] **Change Password**: Update password
  - Expected: Password changes, can login with new password
- [ ] **Add Address**: Add new shipping address
  - Expected: Address saves, appears in list
- [ ] **Edit Address**: Modify existing address
  - Expected: Changes save
- [ ] **Delete Address**: Remove address
  - Expected: Address removed
- [ ] **Add Payment**: Add credit card
  - Expected: Payment method saves
- [ ] **Default Payment**: Set default payment
  - Expected: Default updates

**What to Check**:
- ✅ All forms validate
- ✅ Changes save correctly
- ✅ Data persists
- ✅ Error handling works
- ✅ Success messages show

---

## 📱 PART 7: RESPONSIVE DESIGN

### Test 7.1: Mobile Responsiveness

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device toolbar
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**What to Check**:
- ✅ Layout adapts correctly
- ✅ Navigation menu works on mobile
- ✅ Forms are usable on mobile
- ✅ Images scale properly
- ✅ Text is readable
- ✅ Buttons are tappable
- ✅ No horizontal scrolling

---

## 🔍 PART 8: ERROR HANDLING

### Test 8.1: Error Scenarios

**Test Cases**:
- [ ] **404 Page**: Navigate to non-existent page
  - Expected: 404 error page shows
- [ ] **Network Error**: Disconnect internet, try API call
  - Expected: Error message shows
- [ ] **API Error**: Backend returns error
  - Expected: User-friendly error message
- [ ] **Form Validation**: Submit invalid forms
  - Expected: Clear validation errors

---

## 📊 TESTING CHECKLIST SUMMARY

### Authentication ✅
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Password reset works
- [ ] Session persists

### Homepage ✅
- [ ] Page loads
- [ ] All sections render
- [ ] Navigation works
- [ ] Responsive design

### Products ✅
- [ ] Product listing works
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Product detail page works

### Cart ✅
- [ ] Add to cart works
- [ ] Cart management works
- [ ] Cart persists

### Checkout ✅
- [ ] Checkout flow works
- [ ] Order creation works
- [ ] Confirmation shows

### Account ✅
- [ ] Dashboard works
- [ ] Order history works
- [ ] Wishlist works
- [ ] Settings work

---

## 🐛 REPORTING ISSUES

When you find an issue, document:
1. **What you were testing**: Test case name
2. **Steps to reproduce**: Detailed steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happened
5. **Screenshots**: If applicable
6. **Browser/Device**: Chrome/Firefox, Mobile/Desktop
7. **Console errors**: Any errors in DevTools

---

## ✅ NEXT STEPS AFTER TESTING

1. **Document all issues** in the test execution report
2. **Prioritize fixes**:
   - Critical: Blocks core functionality
   - High: Major feature broken
   - Medium: Minor issue, workaround exists
   - Low: Cosmetic or enhancement
3. **Fix issues** one by one
4. **Retest** after fixes
5. **Move to next phase**: Admin Portal testing

---

**Good luck with testing! 🚀**
