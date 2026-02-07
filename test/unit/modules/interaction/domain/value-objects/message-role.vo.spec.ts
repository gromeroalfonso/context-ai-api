import { describe, it, expect } from '@jest/globals';
import { MessageRole } from '@modules/interaction/domain/value-objects/message-role.vo';

describe('MessageRole Value Object', () => {
  describe('Valid Roles', () => {
    it('should accept "user" role', () => {
      const role: MessageRole = 'user';
      expect(role).toBe('user');
    });

    it('should accept "assistant" role', () => {
      const role: MessageRole = 'assistant';
      expect(role).toBe('assistant');
    });

    it('should accept "system" role', () => {
      const role: MessageRole = 'system';
      expect(role).toBe('system');
    });
  });

  describe('Type Safety', () => {
    it('should be a string literal union type', () => {
      const userRole: MessageRole = 'user';
      const assistantRole: MessageRole = 'assistant';
      const systemRole: MessageRole = 'system';

      expect(typeof userRole).toBe('string');
      expect(typeof assistantRole).toBe('string');
      expect(typeof systemRole).toBe('string');
    });
  });

  describe('Constants', () => {
    it('should provide role constants', () => {
      expect('user' as MessageRole).toBe('user');
      expect('assistant' as MessageRole).toBe('assistant');
      expect('system' as MessageRole).toBe('system');
    });
  });
});

