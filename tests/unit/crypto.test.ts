import { describe, expect, it } from 'vitest';
import { encrypt, decrypt } from '@/lib/security/crypto';

describe('crypto', () => {
  it('encrypts and decrypts token', () => {
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012';
    const encrypted = encrypt('my-secret');
    expect(decrypt(encrypted)).toBe('my-secret');
  });
});
