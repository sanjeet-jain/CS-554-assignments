import { GraphQLError } from "graphql";

import {
  employees as employeeCollection,
  employers as employerCollection,
} from "./config/mongoCollections.js";

import { v4 as uuid } from "uuid"; //for generating _id's

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

export const resolvers = {};
