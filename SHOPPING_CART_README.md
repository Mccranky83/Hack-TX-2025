# Shopping Cart Implementation

This document describes the shopping cart functionality that has been implemented for the Undetectable fashion app.

## Features Implemented

### 1. Shopping Cart Context (`src/contexts/CartContext.tsx`)
- Global state management for cart items
- Support for both regular products and custom designs
- Persistent storage using localStorage
- Cart operations: add, remove, update quantity, clear

### 2. Cart UI Components

#### Cart Button (`src/components/CartButton.tsx`)
- Displays cart icon with item count badge
- Toggles cart drawer visibility
- Integrated into dashboard navigation

#### Cart Drawer (`src/components/CartDrawer.tsx`)
- Slide-out cart panel
- Displays cart items with design previews
- Quantity controls and item removal
- Proceed to checkout functionality

#### Order Modal (`src/components/OrderModal.tsx`)
- Modal for ordering custom designs
- Size and color selection
- Quantity selection
- Dynamic pricing based on design type and test results

### 3. Checkout Page (`src/app/checkout/page.tsx`)
- Order summary display
- Payment processing simulation
- Order completion confirmation
- Stripe integration ready

### 4. Integration Points

#### Dashboard (`src/app/dashboard/page.tsx`)
- Order buttons on saved designs now functional
- Cart button in navigation
- Order modal integration

#### Design Page (`src/app/design/page.tsx`)
- Order button now opens order modal
- Current design can be ordered directly

## Usage

### Adding Items to Cart
1. From Dashboard: Click "Order" button on any saved design
2. From Design Page: Click "Order" button while designing
3. Select size, color, and quantity in the order modal
4. Click "Add to Cart"

### Managing Cart
1. Click the cart button in the navigation
2. View all items in the cart drawer
3. Adjust quantities or remove items
4. Click "Proceed to Checkout" to go to checkout page

### Checkout Process
1. Review order summary
2. Click "Pay" button to simulate payment
3. Receive order confirmation

## Stripe Integration

The app is set up for Stripe integration:

1. **Configuration**: `src/lib/stripe.ts` contains Stripe setup
2. **Environment Variables**: Add your Stripe keys to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

3. **Checkout**: The checkout page is ready for Stripe Checkout integration

## Data Types

### CartItem (Regular Products)
```typescript
interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}
```

### CustomDesignCartItem (Custom Designs)
```typescript
interface CustomDesignCartItem {
  id: string;
  design: SavedDesign;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  price: number;
}
```

## Pricing Logic

Custom designs are priced based on:
- **Base Price**: $29.99 for shirts, $59.99 for hoodies
- **Privacy Multiplier**: 1.2x for tested & ready designs, 1.0x for untested
- **Final Price**: Base Price × Privacy Multiplier

## Future Enhancements

1. **Real Stripe Integration**: Replace simulation with actual Stripe Checkout
2. **Order History**: Track completed orders
3. **User Accounts**: Associate orders with user accounts
4. **Inventory Management**: Track stock levels
5. **Shipping Options**: Add shipping cost calculation
6. **Discount Codes**: Support for promotional codes
7. **Email Notifications**: Send order confirmations

## Testing

To test the shopping cart:
1. Create some designs in the design page
2. Save them to see them in the dashboard
3. Click "Order" on any design
4. Add items to cart
5. View cart and proceed to checkout
6. Complete the checkout process
