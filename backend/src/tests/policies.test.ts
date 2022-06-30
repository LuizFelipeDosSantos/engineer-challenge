import {describe, expect} from '@jest/globals';
import request from 'supertest';
import app from '../index';

  describe("Server is responding", () => {
    it("GET --> status 200", () => {
      return request(app).get("/").expect(200);
    });
  });
  
  describe("Requests to server correctly processed", () => {
    let res: any;
    let policies: any[] = [];

    beforeAll(async () => {
      res = await request(app).get("/policies").send();
      policies = res.body;
    });
    
    it("Status are only 'ACTIVE' or 'PENDING'", async () => {
      policies.forEach((policy) => {
        expect(["ACTIVE", "PENDING"]).toContain(policy.status);
      });
    });
  
    it("Check search functionality is working", async () => {
      const policy = await request(app).get("/policies?search=Tani").send();
      expect(policy.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ customer: { firstName: "Tani" } })])
      );
    });
  });