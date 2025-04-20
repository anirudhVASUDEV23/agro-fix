# Bulk Vegetable/Fruit Order Web Application

## Project Overview

This web application facilitates bulk vegetable and fruit orders where buyers can browse available products, place orders, and track their order status. Admins can manage the products and orders efficiently. The system is built using **Next.js** (with **TypeScript**), **React.js**, **Prisma ORM**, and **PostgreSQL** as the database. **Clerk** is used for user authentication (including Google OAuth).

## Features

### For Buyers:
- Browse the product catalog (vegetables and fruits).
- Place bulk orders by selecting products and providing required details (e.g., delivery address).
- Track the status of orders using the order ID.

### For Admins:
- Manage the product catalog (add, edit, or delete products).
- View and manage all orders.
- Update the order status (e.g., "Pending", "In Progress", "Delivered").

### Authentication:
- Users can sign in or sign up using **Google** via **Clerk** authentication.
- Admins can log in using pre-configured credentials for admin management.

## Tech Stack

- **Frontend**: Next.js, React.js, TypeScript, Chakra UI, Axios
- **Backend**: Next.js API routes, PostgreSQL, Prisma ORM
- **Authentication**: Clerk (Google OAuth via Clerk Webhooks)
- **Database**: PostgreSQL (hosted on Neon.tech or via Docker)
- **Styling**: Chakra UI, Tailwind CSS (Optional)

## Setup Instructions

### Prerequisites

- **Node.js** and **npm/yarn** installed.
- **PostgreSQL** database setup (using **Neon.tech** or **Docker**).
- **Clerk** account for authentication.

### Installation

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Database Setup**:
    - If using **Neon.tech**: Create a database on [Neon.tech](https://neon.tech/), and update the database credentials in `.env`.
    - If using **Docker**: Set up a PostgreSQL container and update the `.env` file with the connection details.

4. **Set up environment variables**:
    - Create a `.env` file in the root of the project with the following values:
    ```env
    DATABASE_URL=your-database-connection-string
    CLERK_FRONTEND_API=your-clerk-frontend-api-key
    CLERK_API_KEY=your-clerk-api-key
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    ```

5. **Run the application**:
    - For development:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    - The app will be available at `http://localhost:3000`.

### Admin Role Credentials

To access the **admin dashboard**, use the following credentials:
- **Email**: admin@example.com
- **Password**: agro-fix-admin

### Clerk Authentication (Google OAuth)

For users who want to sign up or sign in:
- Use **Google** login via **Clerk**.
- Clerk webhooks are used to handle authentication and ensure secure user management.

### Database Schema

- **User Model**:
    - `clerkUserId`: Unique identifier for the user (from Clerk).
    - `email`: User's email (unique).
    - `name`: User's name.
    - `role`: The user's role (either "buyer" or "admin").
    - `orders`: Relation to orders placed by the user.

- **Product Model**:
    - `id`: Unique identifier for the product.
    - `name`: Name of the product (e.g., "Apple", "Carrot").
    - `price`: Price of the product.
    - `orders`: Relation to orders that contain the product.

- **Order Model**:
    - `id`: Unique identifier for the order.
    - `buyer_name`: Name of the buyer.
    - `buyer_contact`: Contact information for the buyer.
    - `delivery_address`: Address for delivery.
    - `items`: List of items in the order (serialized as JSON).
    - `status`: The current status of the order (e.g., "Pending", "In Progress", "Delivered").
    - `userId`: Reference to the user who placed the order.
    - `user`: Relation to the `User` model.
    - `products`: Relation to the `Product` model for the products in the order.

### API Endpoints

- `GET /api/products`: Fetch the product catalog.
- `POST /api/orders`: Place a new order.
- `GET /api/orders/:id`: Get order details (buyer view).
- `GET /api/orders`: View all orders (admin view).
- `PUT /api/orders/:id`: Update order status (admin).
- `POST /api/products`: Add a new product (admin).
- `PUT /api/products/:id`: Edit a product (admin).
- `DELETE /api/products/:id`: Delete a product (admin).

### Deployment

- **Vercel Deployment**:
    - Create an account on [Vercel](https://vercel.com/).
    - Connect your GitHub repository to Vercel.
    - Configure environment variables (same as `.env`).
    - Deploy the app on Vercel.

- The live application can be accessed at:  
  **[Vercel Deployment URL](your-vercel-deployment-url)**.

## Contributing

Feel free to fork this project and contribute by submitting issues or pull requests. Please ensure you follow the code style and add comments where necessary for clarity.

## License

This project is licensed under the MIT License.

---

### Additional Notes

- **Google Authentication via Clerk**: If you are integrating Google sign-in, make sure to configure the **Clerk API keys** and **Frontend API key** in the `.env` file. Clerk webhooks will handle the authentication and ensure secure user management.
- **Product and Order Management**: Admins can view, add, and manage products, and update the status of orders to reflect the processing stages of bulk orders.
