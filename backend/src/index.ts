import express from 'express';
import { PrismaClient, Prisma, PolicyStatus, InsuranceType } from '@prisma/client';
import { start } from 'repl';
const cors = require('cors');

const app = express();
const port = 4000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/policies', async (req, res) => {
  try {
    const { nameProviderFilter, typeFilter, statusFilter } = req.query;
    const filterStatus: string[] = statusFilter === 'Status' 
      ? ['ACTIVE', 'PENDING'] 
      : [statusFilter as string];

    const or: Prisma.PolicyWhereInput = nameProviderFilter
      ? {
        OR: [
          { provider: { contains: nameProviderFilter as string, mode: 'insensitive' } },
          { customer: { firstName: { contains: nameProviderFilter as string, mode: 'insensitive' } } },
          { customer: { lastName: { contains: nameProviderFilter as string, mode: 'insensitive' } } }
        ],
      }
      : {};

    const whereFilter = {
      ...or,
      status: { in: filterStatus as unknown as PolicyStatus },
    };

    if(typeFilter !== 'Type'){
      whereFilter.insuranceType = {equals: typeFilter as unknown as InsuranceType}
    };

    const policies = await prisma.policy.findMany({
      where: whereFilter,
      select: {
        id: true,
        provider: true,
        insuranceType: true,
        status: true,
        startDate: true,
        endDate: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true
          }
        }
      }
    })
  
    res.json(policies); 
  } catch (error) {
    res.json({errorMessage: error});
  }
})

app.get('/', (req, res) => {
  res.send('Server is up and running 🚀')
})

app.listen(port, () => {
  console.log(`🚀  Server ready at ${port}`);
});
