import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

class PolicyService {

    async getPolicies(search: string) {
        const or: Prisma.PolicyWhereInput = search
          ? {
            OR: [
              { customer: { firstName: { contains: search, mode: 'insensitive' } } },
              { customer: { lastName: { contains: search, mode: 'insensitive' } } },
              { familyMembers: { some: { firstName: { contains: search, mode: 'insensitive' } } } },
              { familyMembers: { some: { lastName: { contains: search, mode: 'insensitive' } } } },
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

        return policies;              
    }
}

module.exports = PolicyService;