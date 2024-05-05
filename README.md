# Vidly Video Store Management App

The Vidly Video Store Management App is designed to assist employees working behind the counter of a video store in managing their inventory, customers, rentals, and more.

## Getting Started

To run the app, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/funkybooboo/Vidly.git
    ```

2. Navigate to the project directory:

    ```bash
    cd vidly
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up the environment variable for JWT private key. Replace `<your-secret-key>` with your preferred secret key:

    ```bash
    export vidly_jwtPrivateKey=<your-secret-key>
    ```

5. Start the server:

    ```bash
    npm start
    ```

6. The server should now be running on `http://localhost:3000`.

## Usage

### API Endpoints

- **Genres**: Manage movie genres.
- **Customers**: Manage customer information.
- **Movies**: Manage movie inventory.
- **Rentals**: Record and manage movie rentals.
- **Users**: Manage user accounts.

### Authentication

Some routes require authentication using JSON Web Tokens (JWT). 
To access these routes, you need to obtain a JWT token by registering as a user or logging in.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve this project.
