import { describe, it, expect } from 'vitest';
import { formatNumber, formatPrice, isValidEmail, truncate } from '@/utils/helpers';

describe('Helper Functions', () => {
  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('formatPrice', () => {
    it('formats price with default currency', () => {
      expect(formatPrice(99.99)).toBe('R99.99');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('notanemail')).toBe(false);
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long ...');
    });
  });
});
