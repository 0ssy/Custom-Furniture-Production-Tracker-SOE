DevLog6 — Backend Development Progress
Project: Custom Furniture Production Tracker

Date: 5 November 2026

Branch: backend

Developer responsibility: Backend and Database

1. Introduction
This development session focused on expanding the backend of the Custom Furniture Production Tracker.

The backend is responsible for receiving requests from the frontend, processing information, validating data and communicating with the MongoDB database.

The project uses the following technologies:
- Node.js: Provides the JavaScript runtime environment.
- Express.js: Handles HTTP requests and API routes.
- TypeScript: Provides static typing and helps identify errors during development.
- MongoDB: Stores the application's data.
- Mongoose: Provides models and schema validation for MongoDB.
The backend development follows a structured approach. Each module is developed in stages:
1. Create the database model.
2. Create the controller.
3. Create the routes.
4. Register the routes in app.ts.
5. Run the TypeScript check.
This structure helps keep the code organised and makes it easier to maintain.
2. Furniture Management Module
2.1 Purpose
The Furniture module manages the furniture products that can be created and ordered through the system.

It stores information about furniture names, descriptions, categories, prices, dimensions and availability.
2.2 Furniture Model
File created:

src/models/Furniture.ts

The model defines the following fields:
Field	Data type	Description
name	String	Name of the furniture
description	String	Furniture description
category	String	Furniture category
basePrice	Number	Base price of the furniture
dimensions.length	Number	Length measurement
dimensions.width	Number	Width measurement
dimensions.height	Number	Height measurement
isAvailable	Boolean	Availability of the furniture

The furniture categories are:
- Chair
- Table
- Bed
- Sofa
- Cabinet
- Other
The model also includes validation:
- Furniture name is required.
- Description is required.
- Category must be one of the permitted values.
- Base price cannot be negative.
- Dimensions cannot be negative.
- Availability defaults to true.
Mongoose timestamps were enabled to record when a furniture record is created and updated.
2.3 Furniture Controller
File created:

src/controllers/furnitureController.ts

The controller contains five main operations:
1. createFurniture – Creates a new furniture record.
2. getAllFurniture – Retrieves all furniture records.
3. getFurnitureById – Retrieves a specific furniture record.
4. updateFurniture – Updates an existing furniture record.
5. deleteFurniture – Deletes a furniture record.
The update operation uses Mongoose's findByIdAndUpdate() method with validation enabled.
2.4 Furniture Routes
File created:

src/routes/furnitureRoutes.ts

The following API endpoints were configured:
HTTP method	Endpoint	Function
POST	/api/furniture	Create furniture
GET	/api/furniture	Retrieve all furniture
GET	/api/furniture/:id	Retrieve one furniture record
PUT	/api/furniture/:id	Update furniture
DELETE	/api/furniture/:id	Delete furniture

The routes were registered in src/app.ts:
app.use("/api/furniture", furnitureRoutes);


2.5 What I learned
I learned how to structure a Mongoose model, define validation rules and separate database operations from API routing.

I also learned how CRUD operations allow an application to create, retrieve, update and delete records.

3. Material Management Module
3.1 Purpose
The Material module manages the materials required for furniture production.

It stores information about material names, descriptions, categories, stock quantities and costs.
3.2 Material Model
File created:

src/models/Material.ts

The model contains the following fields:
Field	Data type	Description
name	String	Material name
description	String	Material description
category	String	Material category
unit	String	Measurement unit
quantityInStock	Number	Available stock quantity
unitCost	Number	Cost per unit
reorderLevel	Number	Stock level for considering replenishment

The permitted material categories are:
- Timber
- Hardware
- Fabric
- Finishing
- Other
The permitted measurement units are:
- Pieces
- Metres
- Sheets
- Litres
- Kilograms
Validation was included to ensure that:
- Required fields are provided.
- Stock quantity cannot be negative.
- Unit cost cannot be negative.
- Reorder level cannot be negative.
- Stock quantity defaults to zero.
- Reorder level defaults to zero.
Mongoose timestamps were also enabled.
3.3 Material Controller
File created:

src/controllers/materialController.ts

The controller implements five operations:
1. createMaterial – Adds a new material.
2. getAllMaterials – Retrieves all materials.
3. getMaterialById – Retrieves a specific material.
4. updateMaterial – Updates material information.
5. deleteMaterial – Deletes a material record.
The controller uses Mongoose methods to communicate with the database.
3.4 Material Routes
File created:

src/routes/materialRoutes.ts

The configured endpoints are:
HTTP method	Endpoint	Function
POST	/api/materials	Add material
GET	/api/materials	Retrieve all materials
GET	/api/materials/:id	Retrieve one material
PUT	/api/materials/:id	Update material
DELETE	/api/materials/:id	Delete material

The routes were registered in src/app.ts:
app.use("/api/materials", materialRoutes);


3.5 What I learned
I learned how to represent inventory information in MongoDB.

I also learned the importance of data validation, particularly when working with numerical values such as stock quantities, costs and reorder levels.

The current implementation records stock quantities but does not yet include a separate stock movement history.

4. Order Management Module
4.1 Purpose
The Order module connects customers to the furniture they request.

It records which customer placed an order, which furniture items were requested, their quantities, agreed prices and expected delivery date.

An order can contain more than one furniture item.

For example, a customer might order:
Furniture	Quantity	Unit price	Subtotal
Dining table	2	15,000	30,000
Wardrobe	1	25,000	25,000
Total			55,000

4.2 Order Model
File created:

src/models/Order.ts

The model contains:
Field	Data type	Description
customer	ObjectId	Reference to Customer
items	Array	Furniture items in the order
furniture	ObjectId	Reference to Furniture
quantity	Number	Number of units ordered
unitPrice	Number	Agreed price per unit
totalAmount	Number	Total order cost
orderStatus	String	Current order status
orderDate	Date	Date the order was placed
expectedDeliveryDate	Date	Expected delivery date

The order item structure contains three fields:
- furniture
- quantity
- unitPrice
The model uses MongoDB ObjectId references to connect orders to existing Customer and Furniture collections.

The permitted order statuses are:
- Pending
- Confirmed
- In Production
- Completed
- Delivered
- Cancelled
The model also includes validation:
- A customer reference is required.
- At least one furniture item must be included.
- Quantity must be at least one.
- Unit price cannot be negative.
- Expected delivery date is required.
- New orders default to Pending.
4.3 Order Controller
File created:

src/controllers/orderController.ts

The controller implements:
1. createOrder – Creates a new order.
2. getAllOrders – Retrieves all orders.
3. getOrderById – Retrieves a specific order.
4. updateOrder – Updates an existing order.
5. deleteOrder – Deletes an order.
One important feature implemented in this controller is automatic order total calculation.

Instead of trusting the frontend to provide the total, the backend calculates it using:
Total Amount = Quantity × Unit Price


For orders containing multiple items, the subtotals are added together.

The controller also uses Mongoose's populate() method when retrieving orders.

This allows the system to retrieve the associated customer and furniture information instead of returning only their ObjectIds.
4.4 Order Routes
File created:

src/routes/orderRoutes.ts

The configured endpoints are:
HTTP method	Endpoint	Function
POST	/api/orders	Create an order
GET	/api/orders	Retrieve all orders
GET	/api/orders/:id	Retrieve one order
PUT	/api/orders/:id	Update an order
DELETE	/api/orders/:id	Delete an order

The routes were registered in src/app.ts:
app.use("/api/orders", orderRoutes);


4.5 What I learned
I learned how different database collections can be connected using ObjectId references.

I also learned how to use populate() to retrieve related records.

Another important lesson was that calculations involving important business information should be handled by the backend rather than relying entirely on values submitted by the frontend.

5. Payment Management Module
5.1 Purpose
The Payment module records payments made towards customer orders.

It allows the system to associate payment records with orders and record the amount, payment method, payment status and transaction reference.

It also supports multiple payment records for one order, which can be useful when customers pay in instalments.
5.2 Payment Model
File created:

src/models/Payment.ts

The model contains:
Field	Data type	Description
order	ObjectId	Reference to Order
amount	Number	Amount paid
paymentMethod	String	Payment method
paymentStatus	String	Current payment status
paymentDate	Date	Date of payment
transactionReference	String	Optional transaction reference

The permitted payment methods are:
- Cash
- Bank Transfer
- Card
- Mobile Money
The permitted payment statuses are:
- Pending
- Completed
- Failed
- Refunded
Validation was included to ensure that:
- An order reference is provided.
- Payment amount is greater than zero.
- Payment method must be one of the permitted values.
- New payments default to Pending.
- Payment date defaults to the current date.
The transaction reference is optional.

Mongoose timestamps were enabled.
5.3 Payment Controller
File created:

src/controllers/paymentController.ts

The controller implements five operations:
1. createPayment – Records a new payment.
2. getAllPayments – Retrieves all payments.
3. getPaymentById – Retrieves a specific payment.
4. updatePayment – Updates a payment.
5. deletePayment – Deletes a payment.
The controller checks that the order ID has a valid MongoDB ObjectId format, that the payment amount is positive and that the payment method is supported.

It also uses populate("order") when retrieving payment records.
5.4 Payment Routes
File created:

src/routes/paymentRoutes.ts

The configured endpoints are:
HTTP method	Endpoint	Function
POST	/api/payments	Record a payment
GET	/api/payments	Retrieve all payments
GET	/api/payments/:id	Retrieve one payment
PUT	/api/payments/:id	Update a payment
DELETE	/api/payments/:id	Delete a payment

The routes were registered in src/app.ts:
app.use("/api/payments", paymentRoutes);


5.5 What I learned
I learned how to connect payment records to orders and how to use enumerated values to restrict payment methods and statuses.

I also learned how one order can have multiple associated payment records.

6. Production Management Module
6.1 Purpose
The Production module tracks the progress of furniture production.

It connects production records to customer orders and records the current production status, start date, completion date and additional notes.
6.2 Production Model
File created:

src/models/Production.ts

The model contains:
Field	Data type	Description
order	ObjectId	Reference to Order
productionStatus	String	Current production status
startDate	Date	Production start date
completionDate	Date	Production completion date
notes	String	Additional production information

The permitted production statuses are:
- Not Started
- In Progress
- Completed
- On Hold
New production records default to Not Started.

The start date, completion date and notes are optional.

The model uses an ObjectId reference to connect production records to the Order collection.

Mongoose timestamps were enabled.
6.3 Production Controller
File created:

src/controllers/productionController.ts

The controller implements five operations:
1. createProduction – Creates a production record.
2. getAllProduction – Retrieves all production records.
3. getProductionById – Retrieves one production record.
4. updateProduction – Updates production information.
5. deleteProduction – Deletes a production record.
The controller also uses populate("order") when retrieving production records.
6.4 Production Routes
File created:

src/routes/productionRoutes.ts

The configured endpoints are:
HTTP method	Endpoint	Function
POST	/api/production	Create a production record
GET	/api/production	Retrieve all production records
GET	/api/production/:id	Retrieve one production record
PUT	/api/production/:id	Update a production record
DELETE	/api/production/:id	Delete a production record

The routes were registered in src/app.ts:
app.use("/api/production", productionRoutes);


6.5 What I learned
I learned how production records can be associated with customer orders.

I also learned how enumerated status values can be used to track the progress of a process.

7. Connecting the Modules in Express
After creating the individual routers, they were imported and registered in:

src/app.ts

The registrations for the modules covered in this development session are:
app.use("/api/furniture", furnitureRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/production", productionRoutes);


The Customer routes were already registered from the earlier development work.

This step is important because creating a route file alone does not automatically make its endpoints available through the Express application.

The router must be imported and registered using app.use().

8. TypeScript Checks
During development, the following command was used to check the backend code:
npm run typecheck


The command runs the TypeScript compiler without generating build files.

The following checks were reported as successful:
Module	TypeScript check
Furniture	Passed
Material	Passed
Order	Passed
Payment	Passed
Production	Passed

The route integrations were also followed by successful TypeScript checks.

A clean TypeScript check means that the compiler found no TypeScript errors in the checked source files.

However, this does not automatically prove that every API endpoint works correctly with MongoDB. Actual API testing is still necessary.

9. Challenges and Important Design Considerations
During this development stage, several important programming concepts were encountered.
9.1 ObjectId references
MongoDB uses ObjectIds to identify documents.

The Order model references Customer and Furniture records, while Payment references Order and Production also references Order.

This avoids unnecessarily duplicating related information in different collections.
9.2 Data validation
Mongoose schemas include validation rules to help prevent invalid data from being stored.

Examples include:
- Preventing negative prices.
- Requiring important fields.
- Restricting status values.
- Ensuring order quantities are at least one.
9.3 Backend calculations
The Order controller calculates the total order amount rather than accepting the frontend's total as the trusted value.

This helps keep important business calculations under backend control.
9.4 Reference existence
Checking whether an ObjectId has a valid format does not guarantee that the referenced document actually exists.

For example, a customer ID might have the correct format but refer to a customer that is not stored in MongoDB.

This is an improvement to consider during backend validation.
9.5 Testing
TypeScript checks have been successful for the modules covered here.

However, the endpoints still need to be tested to confirm that records can actually be created, retrieved, updated and deleted through API requests.

10. Remaining Work
The backend still has work to complete.

The remaining responsibilities from the original project division include:
1. Delivery management API.
2. Authentication and login.
3. User roles and permissions.
4. Further validation and business logic.
5. API testing using Postman.
6. Connecting and testing the backend with the frontend.
7. Fixing any integration issues.
Additional improvements should only be implemented when they are needed by the project requirements.

11. Conclusion
This development session expanded the backend of the Custom Furniture Production Tracker by implementing Furniture, Material, Order, Payment and Production management.

Each module was developed using Mongoose models, Express controllers and API routes.

The modules were then connected to the main Express application through app.ts.

The development process also improved my understanding of database relationships, schema validation, CRUD operations, ObjectId references, populate() and backend business logic.

All reported TypeScript checks for these modules were clean.

The next stage is to continue with the remaining required backend functionality and test the implemented APIs to confirm that the system works correctly.

End of DevLog6