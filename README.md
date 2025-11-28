# UrbanCanvas - Luxury Fashion E-Commerce
UrbanCanvas is a single-page e-commerce application focused on delivering a luxury shopping UX with animated transitions, polished product pages, multiple payment options, and WhatsApp order notifications. Built mobile-first with Tailwind CSS and animated with GSAP for smooth interactions.


##  Features

### Core Functionality
- **Product Catalog** - Browse products by categories and collections
- **Shopping Cart** - Add, remove, and update product quantities
- **Checkout Process** - Complete order with multiple payment options
- **User Authentication** - Login/register system with user profiles
- **Order Management** - View order history and order details
- **Product Search** - Search functionality across all products

### Payment Integration
- Cash on Delivery
- Bikash 
- Credit Card
- PayPal
- eTransfer

### Advanced Features
- **GSAP Animations** - Smooth page transitions and scroll effects
- **Responsive Design** - Mobile-first approach
- **WhatsApp Integration** - Order notifications via WhatsApp
- **Custom Cursor** - Enhanced user experience
- **Form Validation** - Comprehensive form checking
- **Toast Notifications** - User feedback with react-hot-toast

##  Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **GSAP** - Animations and scroll effects
- **Tailwind CSS** - Styling
- **React Icons** - Icon library

### State Management
- **Redux Toolkit** - Global state management
- **React Redux** - React bindings

### Backend
- **JSON Server** - Mock REST API
- **Axios** - HTTP client




##  Key Components

### Pages
- `Landing` - Homepage with animated banner and collections
- `Shop` - Product listing with categories
- `SingleProduct` - Product detail page with image zoom
- `Cart` - Shopping cart management
- `Checkout` - Order completion with form validation
- `Login/Register` - User authentication
- `UserProfile` - User account management
- `OrderHistory` - Order tracking and details

### Core Components
- `Header` - Navigation with cart counter
- `Footer` - Site footer
- `ProductGrid` - Product display component
- `Button` - Reusable button component
- `Dropdown` - Accordion-style dropdowns

##  Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash

   git clone <your-repo-url>
   cd urbancanvas
   
   ```
   
```bash

Install dependencies
npm install

```

```bash

Start the development server
npm run dev

```

```bash

Start the JSON server (in separate terminal)

npm run server

```

```bash

Build for Production
npm run build

```

#### JSON Server

The backend uses JSON Server with the following endpoints:

-GET /products - Fetch all products

-GET /products/:id - Fetch single product

-GET /orders - Fetch orders

-POST /orders - Create new order

-GET /users - User management

#### State Management

Redux Slices

cartSlice - Shopping cart functionality

authSlice - Authentication state

#### Local Storage
User session persistence

Cart data persistence

#### Form Validation
Custom validation utilities:

checkLoginFormData - Login form validation

checkRegisterFormData - Registration validation

checkCheckoutFormData - Checkout form validation

checkUserProfileFormData - Profile update validation

#### WhatsApp Integration

The app includes WhatsApp order notifications:

Automatic order summary generation

Customer details formatting

Payment method information

Direct WhatsApp message opening

#### Shopping Cart Features
Add/remove products

Quantity updates

Size and color selection

Stock availability checking

Persistent cart state

#### Checkout Process
Shipping Information - Address and contact details

Payment Method - Multiple payment options

Order Summary - Final review before confirmation

Order Confirmation - Success page with tracking

#### Custom Hooks
useAppDispatch - Typed Redux dispatch

useAppSelector - Typed Redux selector


### db.json (example schema snippet)

```
{
  "products": [
    {
      "id": 1,
      "title": "Silk Evening Dress",
      "description": "Luxury silk dress...",
      "price": 249.99,
      "category": "Dresses",
      "images": ["..."],
      "sizes": ["S","M","L"],
      "colors": ["Black","Red"],
      "stock": 12
    }
  ],
  "orders": [],
  "users": []
}


```
---

#### Contributing
``` Fork the repository 

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

 ```
--- 
### License
This project is licensed under the MIT License.


#### Troubleshooting
``` Common Issues
JSON Server not starting

Check if port 5000 is available

Verify db.json file exists

GSAP animations not working

Ensure GSAP is properly registered

Check ScrollTrigger plugin registration

WhatsApp integration issues

Verify phone number format

Check internet connection
```
---

##  Authors

- [**Robiul Hasan Jisan**](https://portfolio-nine-gilt-93.vercel.app/)