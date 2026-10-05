import { describe, it, expect } from 'vitest';
import {
  assertPublicHttpsUrl,
  isPrivateIpv4,
  rewriteCloudStorageUrl,
  sanitizeContentId,
} from './urlGuard';

describe('urlGuard', () => {
  it('プライベートIPv4を検出する', () => {
    expect(isPrivateIpv4('10.0.0.1')).toBe(true);
    expect(isPrivateIpv4('192.168.1.1')).toBe(true);
    expect(isPrivateIpv4('172.16.0.1')).toBe(true);
    expect(isPrivateIpv4('127.0.0.1')).toBe(true);
    expect(isPrivateIpv4('8.8.8.8')).toBe(false);
  });

  it('HTTPS以外とプライベートホストを拒否する', () => {
    expect(() => assertPublicHttpsUrl('http://example.com/a.json')).toThrow('HTTPS_ONLY');
    expect(() => assertPublicHttpsUrl('https://localhost/a.json')).toThrow('PRIVATE_HOST');
    expect(() => assertPublicHttpsUrl('https://192.168.0.1/a.json')).toThrow('PRIVATE_HOST');
  });

  it('Google Drive と Dropbox の共有リンクを正規化する', () => {
    expect(rewriteCloudStorageUrl('https://drive.google.com/file/d/abc123/view?usp=sharing')).toBe(
      'https://drive.google.com/uc?export=download&id=abc123'
    );
    expect(rewriteCloudStorageUrl('https://www.dropbox.com/s/xyz/flow.json?dl=0')).toContain(
      'dl=1'
    );
  });

  it('コンテンツIDをサニタイズする', () => {
    expect(sanitizeContentId('sample')).toBe('sample');
    expect(sanitizeContentId('varubogu/sample.json')).toBe('varubogu/sample');
    expect(() => sanitizeContentId('../secret')).toThrow('INVALID_CONTENT_ID');
  });
});
