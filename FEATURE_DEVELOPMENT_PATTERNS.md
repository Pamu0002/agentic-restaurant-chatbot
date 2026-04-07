# 🤖 Feature Development Patterns - Chatbot & Agents

**Purpose**: Industry-standard patterns for implementing core features  
**Target**: Chatbot interface, Agent system, Discovery engine  
**Approach**: Pattern-first, not code-first  

---

## Part 1: Chatbot Feature Pattern

### Pattern Overview

```
User Input
   ↓
[Input Validation] ← Layer 1
   ↓
[Intent Recognition] ← Layer 2 (NLP)
   ↓
[Context Retrieval] ← Layer 3 (Data)
   ↓
[Response Generation] ← Layer 4 (LLM)
   ↓
[Output Formatting] ← Layer 5
   ↓
User Response
```

### 1.1 Chatbot Service Architecture

**Interface Definition** (defines contract):
```typescript
interface IChatbotService {
  // Core methods
  processMessage(userId: string, message: string): Promise<ChatResponse>;
  getConversationHistory(userId: string, limit?: number): Promise<Message[]>;
  clarifyIntent(conversationId: string, userFeedback: string): Promise<ChatResponse>;
  
  // State management
  saveConversation(userId: string, messages: Message[]): Promise<void>;
  clearConversation(userId: string): Promise<void>;
}

interface ChatResponse {
  id: string;
  conversationId: string;
  intent: string;
  confidence: number;
  response: string;
  suggestedActions: Action[];
  metadata: {
    processingTime: number;
    model: string;
    temperature: number;
  };
}

interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: {
    intent?: string;
    entities?: Entity[];
    timestamp: Date;
  };
}
```

**Test-First Approach**:
```typescript
// Step 1: Write the test for expected behavior
describe('ChatbotService', () => {
  describe('Intent Recognition', () => {
    it('should recognize RESERVATION intent from "book a table"', async () => {
      const response = await chatbotService.processMessage(
        'user-123',
        'I want to book a table for 4 at 7pm tomorrow'
      );
      
      expect(response.intent).toBe('RESERVATION');
      expect(response.confidence).toBeGreaterThan(0.8);
      expect(response.suggestedActions).toContainEqual(
        expect.objectContaining({ type: 'SHOW_AVAILABILITY' })
      );
    });

    it('should handle ambiguous intent with clarification', async () => {
      const response = await chatbotService.processMessage(
        'user-456',
        'Can I get something?'
      );
      
      expect(response.intent).toBe('UNCLEAR');
      expect(response.suggestedActions).toContainEqual(
        expect.objectContaining({ type: 'ASK_CLARIFICATION' })
      );
    });

    it('should maintain context across messages', async () => {
      // User: "Show me restaurants"
      const response1 = await chatbotService.processMessage(
        'user-789',
        'Show me restaurants'
      );
      expect(response1.intent).toBe('DISCOVERY');

      // User: "Make a reservation at one of them"
      const response2 = await chatbotService.processMessage(
        'user-789',
        'Make a reservation at one of them'
      );
      
      // Should understand "them" = restaurants from previous message
      expect(response2.suggestedActions).toContainEqual(
        expect.objectContaining({ type: 'SHOW_RESTAURANTS' })
      );
    });
  });
});

// Step 2: Implement minimum code to pass
class ChatbotService implements IChatbotService {
  constructor(
    private nlpEngine: NLPEngine,
    private contextService: ContextService,
    private llmService: LLMService,
    private conversationRepo: ConversationRepository
  ) {}

  async processMessage(userId: string, message: string): Promise<ChatResponse> {
    // Intent recognition
    const intent = await this.nlpEngine.recognizeIntent(message);
    
    // Get context
    const context = await this.contextService.getContext(userId, message);
    
    // Generate response
    const response = await this.llmService.generateResponse({
      intent,
      message,
      context,
    });
    
    const chatResponse: ChatResponse = {
      id: generateId(),
      conversationId: context.conversationId,
      intent: intent.type,
      confidence: intent.confidence,
      response: response.text,
      suggestedActions: response.actions,
      metadata: {
        processingTime: Date.now() - startTime,
        model: 'gemini-pro',
        temperature: 0.7,
      },
    };

    // Save conversation
    await this.conversationRepo.addMessage({
      conversationId: context.conversationId,
      role: 'assistant',
      content: chatResponse.response,
      metadata: { intent: intent.type },
    });

    return chatResponse;
  }

  async getConversationHistory(
    userId: string,
    limit: number = 50
  ): Promise<Message[]> {
    const conversationId = await this.contextService.getConversationId(userId);
    return this.conversationRepo.getMessages(conversationId, limit);
  }

  async clarifyIntent(
    conversationId: string,
    userFeedback: string
  ): Promise<ChatResponse> {
    // User provides feedback to disambiguate intent
    // Re-run intent recognition with this feedback
    const refined = await this.nlpEngine.refineIntent(
      conversationId,
      userFeedback
    );
    
    return this.processMessage(conversationId.split('-')[0], userFeedback);
  }

  async saveConversation(userId: string, messages: Message[]): Promise<void> {
    const conversationId = await this.contextService.getConversationId(userId);
    for (const msg of messages) {
      await this.conversationRepo.addMessage({
        ...msg,
        conversationId,
      });
    }
  }

  async clearConversation(userId: string): Promise<void> {
    const conversationId = await this.contextService.getConversationId(userId);
    await this.conversationRepo.deleteConversation(conversationId);
  }
}

// Step 3: Refactor for maintainability
// Extract intent recognition to separate service
// Extract context management to separate service
// Add error handling and logging
```

### 1.2 Intent Recognition Pipeline

**Pattern Structure**:

```typescript
interface IntentRecognizer {
  recognize(message: string): Promise<IntentResult>;
}

interface IntentResult {
  type: string;  // RESERVATION, ORDERING, DISCOVERY, etc.
  confidence: number;  // 0-1
  entities: Entity[];  // Extracted data (date, party size, etc.)
  alternatives?: {
    type: string;
    confidence: number;
  }[];
}

// Implementation pattern
class NLPIntentRecognizer implements IntentRecognizer {
  async recognize(message: string): Promise<IntentResult> {
    // Approach 1: Rule-based (fast, low accuracy)
    // Approach 2: ML model (balanced)
    // Approach 3: LLM-based (accurate, slower)
    
    const llmResult = await this.llm.classifyIntent(message);
    const extractedEntities = await this.entityExtractor.extract(message);
    
    return {
      type: llmResult.intent,
      confidence: llmResult.confidence,
      entities: extractedEntities,
      alternatives: llmResult.alternativeIntents,
    };
  }

  private async extractEntities(message: string): Promise<Entity[]> {
    // Use regex patterns for dates, times, numbers
    // Use NER (Named Entity Recognition) for restaurant names, cuisines
    // Use entity extraction from LLM
    
    const patterns = {
      date: /(?:tomorrow|next\s+\w+|(\d{1,2})[/-](\d{1,2}))/gi,
      time: /(\d{1,2}):(\d{2})\s*(am|pm)?/gi,
      partySize: /(?:party\s+of\s+)?(\d+)/i,
      cuisine: /(italian|chinese|french|indian|japanese)/gi,
    };
    
    const entities: Entity[] = [];
    for (const [type, pattern] of Object.entries(patterns)) {
      const matches = message.matchAll(pattern);
      for (const match of matches) {
        entities.push({
          type,
          value: match[0],
          confidence: 0.95,
        });
      }
    }
    
    return entities;
  }
}
```

### 1.3 Context Management

**Pattern: Context as Scoped Data**

```typescript
interface ConversationContext {
  userId: string;
  conversationId: string;
  sessionId: string;
  
  // Conversation state
  currentIntent: string;
  previousIntents: string[];
  messages: Message[];
  
  // User context
  userPreferences: UserPreferences;
  location: Location;
  
  // Temporary data
  lastMentionedRestaurant?: Restaurant;
  lastMentionedCuisine?: string;
  selectedFilters?: FilterCriteria;
  
  // Timing
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;  // Auto-clear old conversations
}

class ContextService {
  async getContext(
    userId: string,
    message: string
  ): Promise<ConversationContext> {
    // Load or create conversation
    let context = await this.contextRepo.getActiveConversation(userId);
    if (!context) {
      context = this.createNewContext(userId);
    }
    
    // Update with message analysis
    context.messages.push({
      role: 'user',
      content: message,
    });
    
    // Extract entities for context
    context.lastMentionedRestaurant = this.extractRestaurant(message);
    context.selectedFilters = this.extractFilters(message);
    
    // Update activity
    context.lastActivityAt = new Date();
    
    // Save
    await this.contextRepo.saveContext(context);
    
    return context;
  }

  async clearOldConversations(maxAge: number = 24 * 60 * 60 * 1000) {
    const cutoff = new Date(Date.now() - maxAge);
    await this.contextRepo.deleteConversationsBefore(cutoff);
  }
}
```

### 1.4 Response Generation Pipeline

**Pattern: Multi-Stage Response Building**

```typescript
interface ResponseGenerator {
  generate(request: GenerationRequest): Promise<GenerationResponse>;
}

interface GenerationRequest {
  intent: string;
  message: string;
  context: ConversationContext;
  temperature?: number;  // 0.7 default (balanced), <0.5 factual, >0.7 creative
}

interface GenerationResponse {
  text: string;
  actions: SuggestedAction[];
  confidence: number;
  alternatives?: string[];
}

class LLMResponseGenerator implements ResponseGenerator {
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    // Build prompt
    const prompt = this.buildPrompt(request);
    
    // Call LLM
    const llmResponse = await this.llm.generate({
      prompt,
      model: 'gemini-pro',
      temperature: request.temperature || 0.7,
      maxTokens: 500,
    });
    
    // Extract actions from response
    const actions = this.extractActions(llmResponse.text);
    
    // Generate alternatives (optional)
    const alternatives = await this.generateAlternatives(request);
    
    return {
      text: llmResponse.text,
      actions,
      confidence: llmResponse.confidence,
      alternatives,
    };
  }

  private buildPrompt(request: GenerationRequest): string {
    // System prompt defines assistant personality
    const systemPrompt = `
      You are a helpful restaurant chatbot assistant.
      Be concise, friendly, and professional.
      Provide specific, actionable information.
      When uncertain, ask for clarification.
    `;

    // Few-shot examples for better accuracy
    const examples = [
      {
        intent: 'RESERVATION',
        input: 'I want to book a table',
        output: 'I\'d be happy to help with your reservation! How many people will be dining, and what date/time works best?',
      },
      // ... more examples
    ];

    // Build context-aware prompt
    const contextPrompt = `
      User Intent: ${request.intent}
      User Message: "${request.message}"
      Previous Messages: ${request.context.messages
        .slice(-3)
        .map(m => `${m.role}: ${m.content}`)
        .join('\n')}
      User Preferences: ${JSON.stringify(request.context.userPreferences)}
    `;

    return `${systemPrompt}\n${contextPrompt}\n\nRespond naturally and helpfully:`;
  }

  private extractActions(responseText: string): SuggestedAction[] {
    // Parse response for actionable items
    // Example: "Would you like to [book a table] or [see menu]?"
    
    const actionPattern = /\[([^\]]+)\]/g;
    const actions: SuggestedAction[] = [];
    
    for (const match of responseText.matchAll(actionPattern)) {
      const action = match[1];
      actions.push({
        type: this.inferActionType(action),
        label: action,
        description: `${action} will be executed if selected`,
      });
    }
    
    return actions;
  }
}
```

---

## Part 2: Agent System Pattern

### Agent Orchestration Architecture

```
User Request
    ↓
[Router] - Determines which agent(s) to use
    ↓
┌───────────────────────────────────────────┐
│ Agent Selection Layer                     │
├───────────────────────────────────────────┤
│ • Discovery Agent    - Find restaurants   │
│ • Menu Agent         - View menus         │
│ • Reservation Agent  - Make reservations │
│ • Payment Agent      - Process payments   │
│ • Support Agent      - Help/FAQs          │
└───────────────────────────────────────────┘
    ↓
[Orchestrator] - Coordinate multi-agent workflows
    ↓
Response to User
```

### 2.1 Agent Interface Pattern

```typescript
interface IAgent {
  capabilities: string[];           // What this agent can do
  priority: number;                 // Execution order
  
  canHandle(intent: string): boolean;
  execute(request: AgentRequest): Promise<AgentResponse>;
  validate(request: AgentRequest): ValidationResult;
}

interface AgentRequest {
  intent: string;
  userId: string;
  conversationId: string;
  context: ConversationContext;
  parameters: Record<string, any>;  // Extracted entities
  previousAgentResults?: AgentResponse[];  // Results from other agents
}

interface AgentResponse {
  agentId: string;
  success: boolean;
  data: any;
  error?: string;
  suggestedNextSteps: string[];
  requiresUserInput: boolean;
  metadata: {
    executionTime: number;
    confidence: number;
  };
}

interface ValidationResult {
  isValid: boolean;
  missingParameters: string[];
  suggestions: string[];
}

// Concrete agent implementation
class DiscoveryAgent implements IAgent {
  capabilities = ['search_restaurants', 'filter_restaurants', 'get_details'];
  priority = 10;

  canHandle(intent: string): boolean {
    return ['DISCOVERY', 'SEARCH', 'BROWSE'].includes(intent);
  }

  async execute(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      // Step 1: Validate request
      const validation = this.validate(request);
      if (!validation.isValid) {
        return {
          agentId: 'discovery-agent',
          success: false,
          data: null,
          error: `Missing parameters: ${validation.missingParameters.join(', ')}`,
          suggestedNextSteps: validation.suggestions,
          requiresUserInput: true,
          metadata: {
            executionTime: Date.now() - startTime,
            confidence: 0,
          },
        };
      }

      // Step 2: Extract search criteria
      const criteria = this.extractSearchCriteria(request);

      // Step 3: Query database
      const restaurants = await this.restaurantService.search(criteria);

      // Step 4: Rank results
      const ranked = this.rankResults(
        restaurants,
        request.context.userPreferences
      );

      return {
        agentId: 'discovery-agent',
        success: true,
        data: ranked.slice(0, 10),  // Top 10
        suggestedNextSteps: [
          'View restaurant details',
          'Filter results',
          'Make a reservation',
        ],
        requiresUserInput: false,
        metadata: {
          executionTime: Date.now() - startTime,
          confidence: 0.95,
        },
      };
    } catch (error) {
      return {
        agentId: 'discovery-agent',
        success: false,
        data: null,
        error: `Discovery failed: ${error.message}`,
        suggestedNextSteps: ['Try different search criteria'],
        requiresUserInput: true,
        metadata: {
          executionTime: Date.now() - startTime,
          confidence: 0,
        },
      };
    }
  }

  validate(request: AgentRequest): ValidationResult {
    const missingParameters = [];
    
    if (!request.parameters.cuisine && !request.parameters.location) {
      missingParameters.push('cuisine or location');
    }
    
    return {
      isValid: missingParameters.length === 0,
      missingParameters,
      suggestions: [
        'Specify a cuisine type (e.g., Italian, Mexican)',
        'Provide a location or neighborhood',
        'Add price range preference',
      ],
    };
  }

  private extractSearchCriteria(request: AgentRequest): SearchCriteria {
    return {
      cuisine: request.parameters.cuisine,
      location: request.parameters.location,
      priceRange: request.parameters.priceRange || 'all',
      rating: request.parameters.minRating || 3.5,
      availability: request.parameters.dateTime,
    };
  }

  private rankResults(
    restaurants: Restaurant[],
    preferences: UserPreferences
  ): Restaurant[] {
    // Score each restaurant
    return restaurants
      .map(r => ({
        restaurant: r,
        score: this.calculateScore(r, preferences),
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.restaurant);
  }
}
```

### 2.2 Agent Orchestrator Pattern

**Multi-Agent Cooperation**:

```typescript
interface IOrchestrator {
  route(intent: string): IAgent[];  // Multiple agents can help
  execute(request: AgentRequest): Promise<OrchestratorResponse>;
  handleFallback(error: Error): Promise<OrchestratorResponse>;
}

interface OrchestratorResponse {
  primaryResponse: AgentResponse;
  secondaryResponses: AgentResponse[];
  combinedData: any;
  userMessage: string;
  suggestedActions: Action[];
}

class AgentOrchestrator implements IOrchestrator {
  private agents: Map<string, IAgent> = new Map();

  registerAgent(id: string, agent: IAgent) {
    this.agents.set(id, agent);
  }

  route(intent: string): IAgent[] {
    // Find all agents that can handle this intent
    return Array.from(this.agents.values())
      .filter(agent => agent.canHandle(intent))
      .sort((a, b) => b.priority - a.priority);  // Higher priority first
  }

  async execute(request: AgentRequest): Promise<OrchestratorResponse> {
    try {
      // Step 1: Route to appropriate agents
      const agents = this.route(request.intent);
      if (agents.length === 0) {
        return this.handleFallback(new Error('No suitable agent found'));
      }

      // Step 2: Execute primary agent
      const primaryAgent = agents[0];
      const primaryResponse = await primaryAgent.execute(request);

      if (!primaryResponse.success && agents.length > 1) {
        // Fallback to secondary agent
        const secondaryAgent = agents[1];
        const secondaryResponse = await secondaryAgent.execute(request);
        
        return {
          primaryResponse: secondaryResponse,
          secondaryResponses: [],
          combinedData: secondaryResponse.data,
          userMessage: this.generateMessage(secondaryResponse),
          suggestedActions: this.generateActions(secondaryResponse),
        };
      }

      // Step 3: For complex tasks, run supporting agents
      let secondaryResponses: AgentResponse[] = [];
      if (request.intent === 'RESERVATION') {
        // Also run validation from availability agent
        const availabilityAgent = this.agents.get('availability-agent');
        if (availabilityAgent) {
          secondaryResponses.push(await availabilityAgent.execute(request));
        }
      }

      return {
        primaryResponse,
        secondaryResponses,
        combinedData: this.combineData(primaryResponse, secondaryResponses),
        userMessage: this.generateMessage(primaryResponse),
        suggestedActions: primaryResponse.suggestedNextSteps.map(s => ({
          label: s,
          type: 'next_step',
        })),
      };
    } catch (error) {
      return this.handleFallback(error);
    }
  }

  async handleFallback(error: Error): Promise<OrchestratorResponse> {
    // Route to support agent
    const supportAgent = this.agents.get('support-agent');
    
    const supportResponse = await supportAgent.execute({
      intent: 'SUPPORT',
      userId: 'unknown',
      conversationId: 'unknown',
      context: null,
      parameters: { error: error.message },
    });

    return {
      primaryResponse: supportResponse,
      secondaryResponses: [],
      combinedData: null,
      userMessage: `I encountered an issue: ${error.message}. Sorry about that!`,
      suggestedActions: [
        { label: 'Contact Support', type: 'escalate' },
        { label: 'Try Again', type: 'retry' },
      ],
    };
  }

  private combineData(
    primary: AgentResponse,
    secondary: AgentResponse[]
  ): any {
    // Merge results from multiple agents
    return {
      primary: primary.data,
      supplementary: secondary.map(r => r.data),
    };
  }

  private generateMessage(response: AgentResponse): string {
    // Convert structured response to natural language
    if (!response.success) {
      return `I wasn't able to help with that: ${response.error}`;
    }
    
    // Format based on intent/agent type
    return `Found ${response.data.length} options for you!`;
  }

  private generateActions(response: AgentResponse): Action[] {
    return response.suggestedNextSteps.map(step => ({
      label: step,
      type: 'next_step',
    }));
  }
}
```

### 2.3 Agent Testing Pattern

```typescript
describe('DiscoveryAgent - Unit Tests', () => {
  let agent: DiscoveryAgent;
  let mockRestaurantService: jest.Mocked<RestaurantService>;

  beforeEach(() => {
    mockRestaurantService = createMock<RestaurantService>();
    agent = new DiscoveryAgent(mockRestaurantService);
  });

  describe('Capability', () => {
    it('should handle DISCOVERY intent', () => {
      expect(agent.canHandle('DISCOVERY')).toBe(true);
    });

    it('should not handle RESERVATION intent', () => {
      expect(agent.canHandle('RESERVATION')).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should require cuisine or location', () => {
      const result = agent.validate({
        intent: 'DISCOVERY',
        userId: 'user-1',
        conversationId: 'conv-1',
        context: null,
        parameters: {},  // Missing cuisine/location
      });

      expect(result.isValid).toBe(false);
      expect(result.missingParameters).toContain('cuisine or location');
    });

    it('should pass with cuisine parameter', () => {
      const result = agent.validate({
        intent: 'DISCOVERY',
        userId: 'user-1',
        conversationId: 'conv-1',
        context: null,
        parameters: { cuisine: 'Italian' },
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('Execution', () => {
    it('should search restaurants by cuisine', async () => {
      const mockRestaurants = [
        { id: '1', name: 'Ristorante', cuisine: 'Italian' },
      ];
      
      mockRestaurantService.search.mockResolvedValue(mockRestaurants);

      const response = await agent.execute({
        intent: 'DISCOVERY',
        userId: 'user-1',
        conversationId: 'conv-1',
        context: createMockContext(),
        parameters: { cuisine: 'Italian' },
      });

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockRestaurants);
    });

    it('should handle search errors gracefully', async () => {
      mockRestaurantService.search.mockRejectedValue(
        new Error('Database error')
      );

      const response = await agent.execute({
        intent: 'DISCOVERY',
        userId: 'user-1',
        conversationId: 'conv-1',
        context: createMockContext(),
        parameters: { cuisine: 'Italian' },
      });

      expect(response.success).toBe(false);
      expect(response.error).toContain('Discovery failed');
    });
  });
});

describe('AgentOrchestrator - Integration Tests', () => {
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    orchestrator = new AgentOrchestrator();
    orchestrator.registerAgent('discovery', new DiscoveryAgent(mockRestaurantService));
    orchestrator.registerAgent('reservation', new ReservationAgent(mockReservationService));
  });

  it('should route DISCOVERY intent to DiscoveryAgent', () => {
    const agents = orchestrator.route('DISCOVERY');
    expect(agents.length).toBeGreaterThan(0);
    expect(agents[0]).toBeInstanceOf(DiscoveryAgent);
  });

  it('should execute matching agent for intent', async () => {
    const response = await orchestrator.execute({
      intent: 'DISCOVERY',
      userId: 'user-1',
      conversationId: 'conv-1',
      context: createMockContext(),
      parameters: { cuisine: 'Italian' },
    });

    expect(response.primaryResponse.success).toBe(true);
  });

  it('should fallback when primary agent fails', async () => {
    // Mock failing primary agent
    const failingAgent = createMock<IAgent>();
    failingAgent.canHandle.mockReturnValue(true);
    failingAgent.execute.mockResolvedValue({
      success: false,
      agentId: 'failing-agent',
      error: 'Failed',
      data: null,
      suggestedNextSteps: [],
      requiresUserInput: true,
      metadata: { executionTime: 100, confidence: 0 },
    });

    orchestrator.registerAgent('failing', failingAgent);

    const response = await orchestrator.execute({
      intent: 'UNKNOWN',
      userId: 'user-1',
      conversationId: 'conv-1',
      context: createMockContext(),
      parameters: {},
    });

    // Should route to support agent
    expect(response.primaryResponse).toBeDefined();
  });
});
```

---

## Part 3: Implementation Roadmap Template

### Per-Feature Checklist

```markdown
## Feature: [Feature Name]

### Phase 1: Interface Design (2 hours)
- [ ] Define interfaces/contracts
- [ ] Create mock implementations
- [ ] Write interface tests
- [ ] Document expected behavior

### Phase 2: Core Implementation (4 hours)
- [ ] Implement service class
- [ ] Add dependency injection
- [ ] Implement core methods
- [ ] Add error handling

### Phase 3: Testing (4 hours)
- [ ] Write unit tests (mocks)
- [ ] Write integration tests
- [ ] Write E2E tests
- [ ] Achieve 70% coverage

### Phase 4: Integration (2 hours)
- [ ] Wire up to routes
- [ ] Add middleware
- [ ] Connect to frontend
- [ ] Test end-to-end

### Phase 5: Refinement (2 hours)
- [ ] Performance optimization
- [ ] Security review
- [ ] Documentation
- [ ] Code review fixes

### Success Criteria
- ✅ All tests passing
- ✅ Coverage > 70%
- ✅ No console errors
- ✅ Documented
- ✅ Code reviewed
```

---

## Quick Reference: Pattern Checklist

### Whenever implementing a new feature:

- [ ] **Interface First**: Define contracts before code
- [ ] **Test-Driven**: Write tests before implementation
- [ ] **Dependency Injection**: Avoid tight coupling
- [ ] **Error Handling**: Try/catch + logging at all layers
- [ ] **Validation**: Input + business logic + database constraints
- [ ] **Documentation**: Types, JSDoc, README
- [ ] **Isolation**: Mocks for unit tests, real for E2E
- [ ] **Monitoring**: Log important operations
- [ ] **Security**: Validate inputs, check auth/authz
- [ ] **Performance**: Consider N+1, caching, response time

