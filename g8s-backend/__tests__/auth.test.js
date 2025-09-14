const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

// Ensure test env
process.env.USE_MONGO = 'false';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

// Mock Supabase Service
const mockCreateUser = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();

jest.mock('../supabase-config', () => {
  class SupabaseService {
    constructor() {
      this.admin = {
        auth: { admin: { createUser: mockCreateUser } },
      };
      this.client = {
        auth: { signInWithPassword: mockSignInWithPassword },
        from: (...args) => mockFrom(...args),
      };
      this.tables = { USERS: 'users' };
    }
  }
  return { SupabaseService };
});

// Build a minimal Express app mounting the auth router
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', require('../routes/auth'));
  return app;
}

// Helpers to mock Supabase profile query chain
function mockProfileOnce(profileRow) {
  mockFrom.mockImplementationOnce(() => ({
    select: (..._sel) => {
      mockSelect();
      return {
        eq: (..._eq) => {
          mockEq();
          return { single: () => Promise.resolve({ data: profileRow, error: null }) };
        },
      };
    },
  }));
}

function mockProfileErrorOnce(message) {
  mockFrom.mockImplementationOnce(() => ({
    select: () => ({
      eq: () => ({ single: () => Promise.resolve({ data: null, error: { message } }) }),
    }),
  }));
}

describe('Auth (Supabase-native)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/register → 201 and JWT on success', async () => {
    const app = buildApp();

    // Supabase admin createUser success
    mockCreateUser.mockResolvedValueOnce({ data: { user: { id: 'uuid-user-1', email: 'a@test.com' } }, error: null });

    // Profile upsert success (handled inside route via client.from(...).upsert)
    // We only need to ensure no error; simulate upsert method via from().upsert()
    mockFrom.mockImplementationOnce(() => ({
      upsert: () => Promise.resolve({ error: null }),
    }));

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@test.com', password: 'StrongP@ss1', firstName: 'A', lastName: 'B' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.id).toBe('uuid-user-1');
    expect(typeof res.body.data.token).toBe('string');
  });

  test('POST /api/auth/register → 400 on Supabase error', async () => {
    const app = buildApp();

    mockCreateUser.mockResolvedValueOnce({ data: null, error: { message: 'email already used' } });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@test.com', password: 'x', firstName: 'A', lastName: 'B' })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/email/i);
  });

  test('POST /api/auth/login → 200 with token and profile', async () => {
    const app = buildApp();

    mockSignInWithPassword.mockResolvedValueOnce({ data: { user: { id: 'uuid-user-2', email: 'b@test.com', email_confirmed_at: new Date().toISOString() } }, error: null });
    mockProfileOnce({ id: 'uuid-user-2', first_name: 'B', last_name: 'C', is_active: true });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'b@test.com', password: 'StrongP@ss1' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('b@test.com');
    expect(res.body.data.user.firstName).toBe('B');
    expect(res.body.data.user.accountStatus).toBe('active');
    expect(typeof res.body.data.token).toBe('string');
  });

  test('POST /api/auth/login → 401 invalid credentials', async () => {
    const app = buildApp();

    mockSignInWithPassword.mockResolvedValueOnce({ data: { user: null }, error: { message: 'invalid' } });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bad@test.com', password: 'wrong' })
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/me → 200 returns Supabase profile (middleware JWT)', async () => {
    const app = buildApp();

    // Build a JWT with user id
    const token = jwt.sign({ id: 'uuid-user-3' }, process.env.JWT_SECRET);
    // Mock profile fetch inside protect middleware
    mockProfileOnce({ id: 'uuid-user-3', email: 'c@test.com', first_name: 'C', last_name: 'D', is_active: true });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.id).toBe('uuid-user-3');
    expect(res.body.data.user.firstName).toBe('C');
  });
});
