# TileForms Frontend

Angular 17+ frontend application for TileForms e-commerce platform.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                 # Core services, guards, interceptors
│   │   │   ├── services/         # Auth, Product, Cart, Order services
│   │   │   ├── guards/           # Authentication guard
│   │   │   └── interceptors/     # HTTP auth interceptor
│   │   ├── shared/               # Shared models, components, pipes
│   │   │   ├── models/           # Data models
│   │   │   ├── components/       # Reusable components
│   │   │   └── pipes/            # Custom pipes
│   │   ├── layout/               # Header, footer, navigation
│   │   ├── features/             # Feature modules
│   │   │   ├── catalog/          # Product listing & details
│   │   │   ├── cart/             # Shopping cart
│   │   │   ├── checkout/         # Checkout process
│   │   │   ├── account/          # Auth & user dashboard
│   │   │   ├── admin/            # Admin dashboard
│   │   │   └── tracking/         # Order tracking
│   │   ├── app.component.ts      # Root component
│   │   ├── app.routes.ts         # Main routing
│   │   └── app.config.ts         # Angular config
│   ├── styles/                   # Global styles (SCSS + Tailwind)
│   ├── environments/             # Environment configs
│   ├── index.html                # HTML entry point
│   ├── main.ts                   # Client bootstrap
│   ├── main.server.ts            # Server bootstrap
│   └── server.ts                 # Express server for SSR
├── angular.json                  # Angular CLI config
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

## Features

- **Product Catalog**: Browse and filter tile-covered furniture
- **Shopping Cart**: Add/remove items, persistent storage
- **Checkout**: Multi-step checkout with address info
- **Authentication**: User login/registration with JWT
- **User Dashboard**: View orders, account info
- **Order Tracking**: Track orders by tracking number
- **Admin Panel**: Manage products and view dashboard stats
- **SSR Ready**: Server-side rendering support with Angular Universal
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Material UI**: Angular Material for polished components

## Technology Stack

- **Framework**: Angular 17
- **Styling**: Tailwind CSS + SCSS
- **UI Components**: Angular Material
- **HTTP Client**: Built-in with interceptors
- **Forms**: Reactive Forms
- **Routing**: Lazy-loaded feature modules
- **State**: Signals and BehaviorSubjects (RxJS)
- **Testing**: Jasmine + Karma
- **Server**: Express.js for SSR
- **Package Manager**: npm

## Installation

```bash
npm install
```

## Development

### Start Development Server
```bash
npm start
```
Runs on `http://localhost:4200`

### Build for Production
```bash
npm run build
```

### Build with SSR
```bash
npm run build:ssr
```

### Run Tests
```bash
npm test
```

### Run with SSR
```bash
npm run serve:ssr
```

## Configuration

### Environment Variables
- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`

Configure API URL and Stripe public key in environment files.

## Key Components

### Authentication
- `AuthService`: Manages login, registration, JWT tokens
- `authGuard`: Protects admin routes
- `authInterceptor`: Adds JWT to HTTP requests

### Services
- `ProductService`: Fetch products with filtering
- `CartService`: Manage cart state and operations
- `OrderService`: Create and track orders
- `AuthService`: User authentication

### Pages
- **Catalog** (`/catalog`): Product listing with filters and pagination
- **Product Detail** (`/catalog/:id`): Product details with variants
- **Cart** (`/cart`): Shopping cart view
- **Checkout** (`/checkout`): Multi-step checkout form
- **Login** (`/account/login`): User login
- **Register** (`/account/register`): User registration
- **Dashboard** (`/account/dashboard`): User dashboard
- **Admin** (`/admin`): Admin dashboard and product management
- **Tracking** (`/tracking`): Order tracking by number

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Material Theming**: Custom TileForms red color scheme
- **SCSS**: Additional component styles
- **Custom Colors**: TileForms brand palette (red/orange)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Follow Angular style guide and TypeScript best practices. Use `OnPush` change detection for components.

## License

Proprietary - TileForms
