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
  
### Admin Role Credentials

To access the **admin dashboard**, use the following credentials:
- **Email**: admin@example.com
- **Password**: agro-fix-admin

## Tech Stack

- **Frontend**: Next.js,TypeScript
- **Backend**: Next.js API routes, PostgreSQL, Prisma ORM
- **Authentication**: Clerk (Google OAuth via Clerk Webhooks)
- **Database**: PostgreSQL (hosted on Neon.tech)
- **Styling**: Shaccn UI,Tailwind v4,framer motion


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
  **[Vercel Deployment URL](https://agro-fix-keet.vercel.app)**.

