import { Request, Response } from 'express';
const router = require("express").Router();
const PoliceService = require("../services/policy.service");
const service = new PoliceService();

router.get('/policies', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const policies = await service.getPolicies(search);
      
    res.status(200).json(policies); 
  } catch (error) {
    res.status(400).json({errorMessage: error});
  }
});

module.exports = router;