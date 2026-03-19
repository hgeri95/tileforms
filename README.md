# TileForms Webshop

> **Handcrafted tile-covered furniture** — A full-stack e-commerce platform for TileForms, selling tile-covered boxes and coffee tables.

[![CI](https://github.com/hgeri95/tileforms/actions/workflows/ci.yml/badge.svg)](https://github.com/hgeri95/tileforms/actions/workflows/ci.yml)

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client Browser                              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────────────┐
│          Angular 17 SSR Frontend  (Cloud Run / Node.js)             │
│   Standalone Components · OnPush · RxJS · Material · Tailwind CSS   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ REST API /api/*
┌──────────────────────────────▼──────────────────────────────────────┐
│         Spring Boot 3 Backend  (Cloud Run / JVM 21)                 │
│   Kotlin · Arrow (Either) · Spring Security JWT · Flyway            │
└────────┬──────────────────┬──────────────────┬───────────────────────┘
         │                  │                  │
┌────────▼──────┐  ┌────────▼──────┐  ┌────────▼──────┐
│  PostgreSQL   │  │     Redis     │  │  Google Cloud  │
│  (Cloud SQL)  │  │  (Memorystore)│  │   Storage      │
│  Main DB      │  │  Cart + Cache │  │  Product Images│
└───────────────┘  └───────────────┘  └────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Angular 17+ (Standalone Components) |
| **Frontend UI** | Angular Material 17 + Tailwind CSS 3 |
| **Frontend State** | RxJS (BehaviorSubject, async pipe) |
| **Frontend SSR** | Angular SSR (Universal) + Express |
| **Backend Framework** | Spring Boot 3.2 |
| **Backend Language** | Kotlin (JVM 21) |
| **FP Library** | Arrow (Either, Option) |
| **Database** | PostgreSQL 16 (Cloud SQL) |
| **Migrations** | Flyway |
| **Caching** | Redis 7 (Memorystore) |
| **Auth** | Spring Security + JWT (JJWT 0.12) |
| **Payments** | Stripe (Google Pay via Stripe) |
| **Shipping** | GLS API |
| **Email** | Spring Mail (JavaMailSender) |
| **Build Tool** | Maven 3.9 (Maven Wrapper) |
| **Infrastructure** | Google Cloud Platform |
| **Container** | Docker + Cloud Run |
| **CI/CD** | GitHub Actions |
| **IaC** | Terraform |

---

## 📁 Folder Structure

```
tileforms/
├── frontend/                   # Angular 17+ SSR app
│   └── src/app/
│       ├── core/               # Auth, guards, interceptors, services
│       ├── shared/             # Reusable components, pipes, models
│       ├── features/           # Feature modules (catalog, cart, checkout, etc.)
│       └── layout/             # Header, footer, navigation
├── backend/                    # Spring Boot 3 Kotlin app
│   └── src/main/kotlin/com/tileforms/
│       ├── product/            # Product catalog (REST + JPA)
│       ├── order/              # Order management
│       ├── cart/               # Redis-backed cart
│       ├── auth/               # JWT authentication
│       ├── payment/            # Stripe / Google Pay
│       ├── shipping/           # GLS carrier integration
│       ├── email/              # Email notifications
│       ├── analytics/          # Admin reporting
│       ├── i18n/               # Multi-currency + locale
│       ├── admin/              # Admin endpoints
│       └── config/             # Security, CORS, Redis config
├── infra/
│   ├── docker/                 # Dockerfiles (frontend, backend)
│   └── terraform/              # GCP infrastructure (Cloud Run, SQL, Redis)
├── .github/workflows/          # CI/CD (ci.yml, deploy.yml)
└── docker-compose.yml          # Local dev environment
```

---

## 🚀 Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Node.js | 20+ |
| Docker | 24+ |
| Docker Compose | 2.20+ |
| Maven | 3.9+ (or use wrapper) |
| Terraform | 1.6+ (for infra only) |

---

## 🏃 Local Development

### Option 1: Full Docker Compose (recommended)

```bash
# Clone the repo
git clone https://github.com/hgeri95/tileforms.git
cd tileforms

# Start all services (PostgreSQL, Redis, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

Services will be available at:
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:8080/api
- **MailHog** (email UI): http://localhost:8025
- **PostgreSQL**: localhost:5432

### Option 2: Run backend & frontend separately

**Backend:**
```bash
cd backend

# Start dependencies only
docker-compose up -d postgres redis mailhog

# Run backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start

# The app runs at http://localhost:4200
```

### 🚀 Quick Start (Local Profile - No Docker Required)

Run the backend with an embedded H2 database — no PostgreSQL, Redis, or Docker needed:

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

- H2 Console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:tileforms`)
- The database schema is auto-created from JPA entities (Flyway is disabled)
- Data is in-memory and resets on each restart

> **Note:** Redis-dependent features (cart caching) and email features won't work without their respective services. Use `docker-compose up redis mailhog` if you need them.

---

## 🧪 Running Tests

**Backend:**
```bash
cd backend
./mvnw test
# Reports: backend/target/surefire-reports/
```

**Frontend:**
```bash
cd frontend
npm test
# Or headless: npm test -- --watch=false --browsers=ChromeHeadless
```

---

## 🏗️ Building for Production

**Backend:**
```bash
cd backend
./mvnw package -DskipTests
# Output: backend/target/tileforms-backend-*.jar
```

**Frontend:**
```bash
cd frontend
npm run build:ssr
# Output: frontend/dist/tileforms-frontend/
```

**Docker images:**
```bash
# Backend
docker build -f infra/docker/Dockerfile.backend -t tileforms-backend ./backend

# Frontend
docker build -f infra/docker/Dockerfile.frontend -t tileforms-frontend ./frontend
```

---

## ☁️ Deployment

### GCP Cloud Run (via Terraform)

1. **Configure Terraform:**
   ```bash
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your GCP project details
   terraform init
   terraform plan
   terraform apply
   ```

2. **CI/CD via GitHub Actions:**
   - Push to `main` branch triggers automatic deployment
   - Required GitHub Secrets:
     - `GCP_PROJECT_ID`
     - `GCP_WORKLOAD_IDENTITY_PROVIDER`
     - `GCP_SERVICE_ACCOUNT`

---

## 🔐 Environment Variables

| Variable | Service | Description | Required |
|----------|---------|-------------|----------|
| `JWT_SECRET` | Backend | JWT signing key (min 256 bits) | ✅ |
| `SPRING_DATASOURCE_URL` | Backend | PostgreSQL JDBC URL | ✅ |
| `SPRING_DATASOURCE_USERNAME` | Backend | DB username | ✅ |
| `SPRING_DATASOURCE_PASSWORD` | Backend | DB password | ✅ |
| `SPRING_DATA_REDIS_HOST` | Backend | Redis hostname | ✅ |
| `SPRING_DATA_REDIS_PORT` | Backend | Redis port (default: 6379) | ❌ |
| `SPRING_MAIL_HOST` | Backend | SMTP host | ✅ |
| `SPRING_MAIL_USERNAME` | Backend | SMTP username | ✅ (prod) |
| `SPRING_MAIL_PASSWORD` | Backend | SMTP password | ✅ (prod) |
| `STRIPE_API_KEY` | Backend | Stripe API key | ✅ (prod) |
| `PORT` | Frontend | Server port (default: 4000) | ❌ |
| `GCP_PROJECT_ID` | CI/CD | GCP project identifier | ✅ (deploy) |

---

## 🗄️ Database Schema

Key tables (see `backend/src/main/resources/db/migration/V1__initial_schema.sql`):

- **users** — Customer accounts (UUID PK, email, role: CUSTOMER/ADMIN/GUEST)
- **products** — Product catalog (UUID PK, name, base_price, category: BOX/COFFEE_TABLE)
- **product_variants** — Color/size variants with SKU and optional price override
- **carts** — Session-based or user-bound carts (also cached in Redis)
- **orders** — Order lifecycle (PENDING → PAID → SHIPPED → DELIVERED)
- **payments** — Payment records (Stripe/Google Pay transactions)

---

## 🌐 API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | — | Login with email/password |
| `POST` | `/api/auth/register` | — | Register new account |
| `GET` | `/api/products` | — | List products (paginated) |
| `GET` | `/api/products/:id` | — | Get product details |
| `POST` | `/api/cart` | — | Create/get cart |
| `POST` | `/api/cart/:id/items` | — | Add item to cart |
| `POST` | `/api/orders` | — | Place an order |
| `GET` | `/api/orders/track/:tracking` | — | Track order by tracking number |
| `POST` | `/api/payments/intent` | JWT | Create Stripe payment intent |
| `GET` | `/api/admin/dashboard` | ADMIN | Admin stats |
| `GET` | `/api/analytics/dashboard` | ADMIN | Analytics data |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please follow:
- [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Angular components must use `standalone: true` and `ChangeDetectionStrategy.OnPush`
- Kotlin code should use Arrow `Either` for error handling — avoid throwing exceptions for business logic
- All PRs must pass CI checks

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.
