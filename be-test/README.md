# Prerequisites
 - MySQL Server (Version 8.0.41)
 - Node (Version 20.16.0)
 - Node Package Manager (Version 10.8.1)
 - K6 (For load testing)

# Installation Steps
 1. Clone the repository.
 2. Cd to the be-test folder.
 3. Run npm i
 4. Create and fill in a .env file inside te be-test folder with the .env.example as the base.
 5. Run `npm run migration:generate -- db/migrations/NewMigration`, then `npm run migration:run` to migrate the database.
 6. Run npm run start to start the server.
 7. Use the provided Postman collection to see the route documentation and test the routes.

# Routes
1. POST '/link' - Used to create new shortened link. Accepts a JSON body with the attributes link(string), and custom_url(string). More information can be viewed inside the postman collection.
2. GET  '/:code' - Used to be redirected to a shortened link's original URL. More information can be viewed inside the postman collection.

# Testing
 - Unit test: Ran by 'npm run test'
 - E2E test: Ran by 'npm run test:e2e'
 - Test Coverage: Ran by 'npm run test:cov', a screenshot of the summary has been saved at the resource folder.
 - Load test: Ran by 'npm run test:load', a screenshot of the summary has been saved at the resource folder. NOTE: If the port you are using inside the .env is not 3001, change the URL in line 23 to adjust accordingly.
