import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
const cors = require('cors');

const app = express();
const port = 4000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/policies', async (req, res) => {
  try {
    const { search } = req.query;

    const or: Prisma.PolicyWhereInput = search
      ? {
        OR: [
          { customer: { firstName: { contains: search as string, mode: 'insensitive' } } },
          { customer: { lastName: { contains: search as string, mode: 'insensitive' } } },
          { familyMembers: { some: { firstName: { contains: search as string, mode: 'insensitive' } } } },
          { familyMembers: { some: { lastName: { contains: search as string, mode: 'insensitive' } } } },
        ],
      }
      : {};

    const policies = await prisma.policy.findMany({
      where: {
        ...or,
        status: { in: ['ACTIVE', 'PENDING'] }
      },
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
        },
        familyMembers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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
