import {describe, it, expect} from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("API Home Route", () => {
    it("should return a welcome message", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Welcome to the Custom Furniture Production Tracker API",
            status: "Server is running",
        });
    });
});

//what it does(Automated API testing):
//sends a GET requset to home route of the api
//checks if the response status is 200
//checks whether the returned JSON CONTAINS THE EXPECTED MESsgae