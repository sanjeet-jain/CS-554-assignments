Certainly! Here's a formatted version of the README with step-by-step instructions:

# Marvel Comics App

## Steps to Run the Code

1. Place the code in a folder.

2. In the root folder, run the following commands:

   ```bash
   npm run client:install
   npm i
   ```

3. Open up a bash terminal.

4. Execute the following command to start the Redis server:

   ```bash
   sudo service redis-server start
   ```

   Provide the sudo password when prompted.

5. Open a Redis CLI by running:

   ```bash
   redis-cli
   ```

   - Type `ping`. It should reply with `pong`.
   - Then, run `FLUSHALL`.

6. To run the complete app, use the following command:

   ```bash
   npm run dev
   ```

7. To run the backend separately, use:

   ```bash
   npm run server
   ```

8. To run the Angular client separately, use:

   ```bash
   npm run client
   ```

Make sure to follow these steps to set up and run the Marvel Comics App successfully. Adjustments might be needed based on your specific environment and configurations.
