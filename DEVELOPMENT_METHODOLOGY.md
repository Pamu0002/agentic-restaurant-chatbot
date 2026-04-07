# 🏛️ Development Methodology - Best Practices & Standards

**Framework**: Agile + Test-Driven Development (TDD)  
**Audience**: Development team  
**Version**: 1.0  

---

## 📊 Development Principles

### 1. Test-Driven Development (TDD)

**The TDD Cycle**:
```
Red → Green → Refactor
│       │       │
└───────┴───────┘
```

**Step 1: Red** - Write failing test
```typescript
// Test what you WANT to exist
describe('ChatbotService', () => {
  it('should parse user intent from message', async () => {
    const result = await chatbotService.parseIntent('I want to reserve a table');
    expect(result.intent).toBe('RESERVATION');
  });
});
```

**Step 2: Green** - Write minimum code to pass
```typescript
// Implement bare minimum
async parseIntent(message: string) {
  if (message.includes('reserve')) return { intent: 'RESERVATION' };
  return { intent: 'UNKNOWN' };
}
```

**Step 3: Refactor** - Improve code quality
```typescript
// Clean up & optimize
async parseIntent(message: string) {
  const keywords = {
    'reserve|book|table': 'RESERVATION',
    'order|food|meal': 'ORDERING',
  };
  
  for (const [pattern, intent] of Object.entries(keywords)) {
    if (new RegExp(pattern, 'i').test(message)) {
      return { intent };
    }
  }
  return { intent: 'UNKNOWN' };
}
```

**Benefits**:
✅ Requirements defined upfront  
✅ Code is testable by design  
✅ Refactoring is safe (tests catch regressions)  
✅ Documentation via tests

---

### 2. Progressive Implementation (Layer by Layer)

**Pyramid Model**:
```
      E2E Tests
       (Happy paths)
          ▲
         / \
        /   \
    Integration
      Tests
       ▲
      / \
     /   \
   Unit Tests
     ▲
    / \
   /   \
Framework Layer
(All dependencies working)
```

**Apply to Each Feature**:

| Layer | Purpose | Duration |
|-------|---------|----------|
| Framework | Dependencies work | 15 min |
| Unit | Business logic | 30 min |
| Integration | HTTP layer | 30 min |
| E2E | User workflows | 15 min |

---

### 3. Isolation & Mocking Strategy

**Dependency Injection Pattern**:

```typescript
// ❌ Tight coupling (hard to test)
class ChatbotService {
  private nlpEngine = new NLPEngine();  // Direct dependency
  
  async parseMessage(msg: string) {
    return this.nlpEngine.process(msg);
  }
}

// ✅ Loose coupling (easy to test)
class ChatbotService {
  constructor(private nlpEngine: NLPEngine) {}  // Injected
  
  async parseMessage(msg: string) {
    return this.nlpEngine.process(msg);
  }
}

// Usage with mocks:
const mockNLP = { process: jest.fn() };
const chatbot = new ChatbotService(mockNLP);
```

**Mock Repository Pattern**:

```typescript
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Real implementation
class FirestoreUserRepository implements IRepository<User> { }

// Mock for testing
class MockUserRepository implements IRepository<User> {
  private data: Map<string, User> = new Map();
  
  async findById(id: string) { return this.data.get(id) || null; }
  async create(data: User) { this.data.set(data.id, data); return data; }
  async update(id: string, data: Partial<User>) { /* ... */ }
  async delete(id: string) { this.data.delete(id); }
}

// Test with mock
test('should find user by id', async () => {
  const mockRepo = new MockUserRepository();
  const repo = new MockUserRepository();
  const user = { id: '1', name: 'John' };
  
  await repo.create(user);
  const found = await repo.findById('1');
  
  expect(found).toEqual(user);
});
```

---

### 4. Error Handling & Validation

**Three-Layer Validation**:

```typescript
// Layer 1: Input Validation
function validateReservationData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors = [];
  
  if (!data.date) errors.push('Date required');
  if (!data.partySize || data.partySize < 1) errors.push('Party size invalid');
  if (data.partySize > 20) errors.push('Party size exceeds maximum');
  
  return { valid: errors.length === 0, errors };
}

// Layer 2: Business Logic Validation
async function checkAvailability(date: string, partySize: number) {
  const available = await restaurant.getAvailableSlots(date, partySize);
  if (!available.length) {
    throw new ValidationError('No availability for requested date/time');
  }
  return available;
}

// Layer 3: Database Constraints
// Firestore rules & indexes ensure data consistency

// Usage
async function createReservation(data: any) {
  // Step 1: Input validation
  const validation = validateReservationData(data);
  if (!validation.valid) {
    throw new InputError(validation.errors);
  }
  
  // Step 2: Business logic validation
  const slots = await checkAvailability(data.date, data.partySize);
  
  // Step 3: Save to database (validated by Firestore rules)
  return await reservationRepo.create({
    ...data,
    status: 'CONFIRMED',
    createdAt: new Date(),
  });
}
```

---

## 🛠️ Feature Development Workflow

### Feature Template

```markdown
# Feature: [Feature Name]

## Overview
[What does this feature do?]

## User Story
As a [User Type]
I want to [Action]
So that [Benefit]

## Acceptance Criteria
- [ ] Users can [action]
- [ ] System validates [requirement]
- [ ] Error handling works for [scenarios]
- [ ] API responds in < [time]ms

## Technical Implementation

### Data Model
\`\`\`typescript
interface [Entity] {
  id: string;
  // Properties
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

### API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/[resource] | Create |
| GET | /api/[resource]/:id | Read |
| PUT | /api/[resource]/:id | Update |
| DELETE | /api/[resource]/:id | Delete |

### Test Cases
- [ ] Unit tests (mocks)
- [ ] Integration tests (HTTP)
- [ ] E2E tests (workflows)
- [ ] Error scenarios

## Definition of Done
- ✅ All tests passing
- ✅ Code review approved  
- ✅ Documentation complete
- ✅ No console warnings/errors
- ✅ Coverage > 70%
```

---

## 📝 Code Style & Review Standards

### TypeScript Best Practices

**Type Safety**:
```typescript
// ❌ Avoid any
function processData(data: any) { }

// ✅ Use specific types
function processData(data: User): User { }

// ✅ Use unions for multiple types
function processData(data: User | Admin): BaseEntity { }

// ✅ Use generics for reusability
function processData<T extends BaseEntity>(data: T): T { }
```

**Error Handling**:
```typescript
// ❌ Silent failures
try {
  await database.save(data);
} catch (e) {
  // Nothing
}

// ✅ Proper error handling
try {
  await database.save(data);
} catch (error) {
  logger.error('Failed to save data', { error, data });
  throw new DatabaseError('Save failed', { cause: error });
}
```

**Async/Await**:
```typescript
// ❌ Promise chains
function getUser(id: string) {
  return database.users.findById(id)
    .then(user => user.profile.load())
    .then(profile => ({ user, profile }));
}

// ✅ Async/await
async function getUser(id: string) {
  const user = await database.users.findById(id);
  const profile = await user.profile.load();
  return { user, profile };
}
```

---

## 🔄 Git Workflow

### Branch Strategy

**Main Branch** - Production-ready
```bash
main
├── Hotfixes (v1.2.1)
└── Releases (v1.2.0)
```

**Development Branch** - Integration point
```bash
develop
├── feature branches
├── bugfix branches
└── release branches
```

**Feature Branches**:
```bash
feature/auth-oauth              # New feature
feature/chatbot-nlp-integration

bugfix/token-expiration-bug     # Bug fix
bugfix/password-validation

refactor/extract-utils          # Refactoring
refactor/consolidate-mocks
```

### Commit Message Format

**Conventional Commits**:
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Examples**:
```
feat(auth): add OAuth2 support
- Integrate Google OAuth provider
- Handle token exchange
- Add profile sync

Closes #123

feat(chatbot): implement intent parsing
- Add NLP service integration
- Support 5 core intents
- Add confidence scoring

fix(reservation): handle timezone correctly
- Parse user timezone from request
- Convert times to restaurant timezone
- Add tests for DST edge cases
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `test`: Test additions/updates
- `docs`: Documentation
- `style`: Code style (no logic change)
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `chore`: Build, deps, etc.

---

## 📊 Performance & Scalability Patterns

### Caching Strategy

```typescript
// Layer 1: In-memory cache
const cache = new Map<string, CacheEntry>();

// Layer 2: Redis cache (for distributed)
await redis.setex(key, 3600, JSON.stringify(data));

// Layer 3: CDN cache (for static assets)
res.set('Cache-Control', 'public, max-age=3600');

// Implementation
async function getUserProfile(userId: string) {
  // Check in-memory
  let profile = cache.get(userId);
  if (profile) return profile;
  
  // Check Redis
  let redis Profile = await redis.get(`user:${userId}`);
  if (redisProfile) {
    cache.set(userId, redisProfile);
    return redisProfile;
  }
  
  // Fetch from database
  profile = await database.users.findById(userId);
  
  // Cache it
  cache.set(userId, profile);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(profile));
  
  return profile;
}
```

### Rate Limiting Pattern

```typescript
// Per-user rate limiting
const rateLimit = new Map<string, RateLimitData>();

function checkRateLimit(userId: string, limit: number = 100): boolean {
  const data = rateLimit.get(userId) || { count: 0, resetTime: Date.now() };
  
  if (Date.now() > data.resetTime) {
    data.count = 0;
    data.resetTime = Date.now() + 60000; // 1 minute
  }
  
  if (data.count >= limit) {
    return false; // Rate limited
  }
  
  data.count++;
  rateLimit.set(userId, data);
  return true;
}

// Middleware
app.use((req, res, next) => {
  const userId = req.user?.id || req.ip;
  if (!checkRateLimit(userId, 100)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
});
```

---

## 🧠 Decision Making Framework

### When to Use What

**REST vs GraphQL**:
```
REST:
✅ Simple CRUD operations
✅ Cacheable responses (HTTP cache)
✅ Standardized tools
✅ Simple frontend (no query optimization needed)

GraphQL:
✅ Complex nested queries
✅ Multiple client platforms with different data needs
✅ Real-time subscriptions
✅ Advanced filtering/sorting
```

**SQL vs NoSQL**:
```
SQL (Firestore/PostgreSQL):
✅ Structured data
✅ Complex relationships
✅ ACID transactions needed
✅ Complex queries

NoSQL (MongoDB/Firebase):
✅ Unstructured/semi-structured data
✅ High scalability
✅ Real-time updates
✅ Simple queries by ID/index
```

**Synchronous vs Asynchronous**:
```
Synchronous:
✅ Request/response needed immediately
✅ Simple error handling
✅ Small operations (< 1 second)

Asynchronous:
✅ Long-running operations (> 1 second)
✅ Background processing
✅ Messages queues/event streaming
✅ Notifications/email sending
```

---

## ✅ Code Review Checklist

### Before PRaring

- [ ] **Functionality**
  - [ ] Feature works as designed
  - [ ] All acceptance criteria met
  - [ ] Error cases handled

- [ ] **Testing**
  - [ ] Unit tests written
  - [ ] Integration tests added
  - [ ] Coverage > 70%
  - [ ] Tests passing

- [ ] **Code Quality**
  - [ ] No console errors/warnings
  - [ ] TypeScript strict mode: no `any`
  - [ ] Proper error handling
  - [ ] DRY principle applied

- [ ] **Performance**
  - [ ] No N+1 queries
  - [ ] Proper caching
  - [ ] Reasonable response time
  - [ ] No memory leaks

- [ ] **Security**
  - [ ] Input validation done
  - [ ] No hardcoded secrets
  - [ ] Auth/authz checked
  - [ ] SQL injection prevented

- [ ] **Documentation**
  - [ ] Code commented where needed
  - [ ] README updated
  - [ ] API docs updated
  - [ ] User guide updated (if applicable)

---

## 🚀 Release Management

### Version Numbering (Semantic Versioning)

```
MAJOR.MINOR.PATCH
1.2.3
│ │ └─ Patch: Bug fixes
│ └─── Minor: New features (backward compatible)
└───── Major: Breaking changes
```

**Examples**:
- `1.0.0` → `1.0.1`: Bug fix
- `1.0.0` → `1.1.0`: New feature added
- `1.0.0` → `2.0.0`: Breaking change

### Release Checklist

- [ ] Version number updated
- [ ] Changelog created
- [ ] Tests passing
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Build successful
- [ ] Deployed to staging
- [ ] Smoke tests pass
- [ ] Tag created (v1.2.3)
- [ ] Release notes published
- [ ] Deployed to production
- [ ] Monitoring alerts set

---

## 📚 Documentation Standards

### Code Documentation Template

```typescript
/**
 * Reserves a table for a user
 *
 * @param {string} userId - Unique user identifier
 * @param {ReservationRequest} request - Reservation details
 * @returns {Promise<Reservation>} Created reservation
 *
 * @throws {ValidationError} If input validation fails
 * @throws {AvailabilityError} If no matching slots
 * @throws {DatabaseError} If save operation fails
 *
 * @example
 * const reservation = await reservationService.create(
 *   'user-123',
 *   {
 *     date: '2024-04-15',
 *     time: '19:00',
 *     partySize: 4
 *   }
 * );
 */
async create(
  userId: string,
  request: ReservationRequest
): Promise<Reservation> {
  // Implementation
}
```

### README Structure

```markdown
# Service/Feature Name

## Overview
[One sentence description]

## Features
- Feature 1
- Feature 2

## Getting Started
### Prerequisites
### Installation
### Configuration

## Usage
### Example 1
### Example 2

## Architecture
- Components
- Data Flow
- Dependencies

## API Reference
### Endpoints
### Error Handling

## Testing
### Running Tests
### Coverage

## Contributing
### Development
### Pull Request Process

## License
```

---

## 🎯 Measurements & Metrics

### Code Quality Metrics

```
Cyclomatic Complexity:           < 10 per function
Test Coverage:                   70-80% (target 80%+)
Code Duplication:                < 5%
Code Maintainability Index:      80+
Average Function Length:         < 50 lines
Comment-to-Code Ratio:           1:5 to 1:10
```

### Performance Metrics

```
API Response Time:               < 500ms (p95)
Database Query Time:             < 100ms (p95)
Memory Usage Per Request:        < 10MB
CPU Usage:                       < 70% under load
Error Rate:                      < 0.1%
```

### Team Metrics

```
Code Review Time:                < 24 hours
Bug Fix Time (High):             < 2 hours
Feature Cycle Time:              3-5 days
Sprint Velocity:                 Track weekly
```

---

## 📚 References & Tools

### Essential Tools
- **Jest**: Unit testing framework
- **Supertest**: HTTP testing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **SonarQube**: Code quality analysis
- **Postman/Insomnia**: API testing
- **GitHub Actions**: CI/CD

### Recommended Learning
- Clean Code (Robert C. Martin)
- Design Patterns (Gang of Four)
- Testing Best Practices
- System Design Interview
- Microservices Patterns

### Internal Documentation
- [Testing Standards](../tests/TESTING_STANDARDS.md)
- [API Design Guide](../docs/API_DESIGN.md)
- [Database Schema](../docs/DATABASE_SCHEMA.md)
- [Security Guidelines](../docs/SECURITY.md)

