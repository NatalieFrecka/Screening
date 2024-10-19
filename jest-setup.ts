import { PrismockClient } from 'prismock';
import prisma from './prisma/client';

jest.mock('@prisma/client', () => ({
  ...jest.requireActual('@prisma/client'),
  PrismaClient: jest.requireActual('prismock').PrismockClient,
}));

beforeEach(() => {
  (prisma as unknown as typeof PrismockClient).reset();
})
