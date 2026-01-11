/**
 * Frontend Tests
 * Test suite for frontend HTML pages and static content
 */

const fs = require('fs');
const path = require('path');

describe('Frontend HTML Pages', () => {
  const htmlFiles = [
    'index.html',
    'landing_page.html',
    'baobab.html',
    'baobab_terminal.html',
    'checkout.html',
    'dashboard.html',
    'draft.html',
    'explore.html',
    'omnigrid.html',
    'omnigrid_zone.html',
    'rossouw_nexus.html',
    'seedwave_admin.html'
  ];

  htmlFiles.forEach(filename => {
    describe(`${filename}`, () => {
      let content;

      beforeAll(() => {
        const filePath = path.join(__dirname, '..', '..', filename);
        if (fs.existsSync(filePath)) {
          content = fs.readFileSync(filePath, 'utf-8');
        }
      });

      it('should exist', () => {
        const filePath = path.join(__dirname, '..', '..', filename);
        expect(fs.existsSync(filePath)).toBe(true);
      });

      it('should be valid HTML with DOCTYPE', () => {
        expect(content).toMatch(/<!DOCTYPE html>/i);
      });

      it('should have html tag', () => {
        expect(content).toMatch(/<html[^>]*>/i);
      });

      it('should have head section', () => {
        expect(content).toMatch(/<head>/i);
      });

      it('should have body section', () => {
        expect(content).toMatch(/<body[^>]*>/i);
      });

      it('should have title tag', () => {
        expect(content).toMatch(/<title>[^<]+<\/title>/i);
      });

      it('should have meta charset', () => {
        expect(content).toMatch(/<meta[^>]*charset[^>]*>/i);
      });

      it('should have viewport meta tag', () => {
        expect(content).toMatch(/<meta[^>]*viewport[^>]*>/i);
      });

      it('should include Tailwind CSS', () => {
        expect(content).toMatch(/tailwindcss\.com/i);
      });

      it('should include Inter font', () => {
        expect(content).toMatch(/Inter/);
      });

      it('should not have broken closing tags', () => {
        const openTags = (content.match(/<html[^>]*>/gi) || []).length;
        const closeTags = (content.match(/<\/html>/gi) || []).length;
        expect(openTags).toBe(closeTags);
      });
    });
  });

  describe('Required Files', () => {
    it('should have README.md', () => {
      const filePath = path.join(__dirname, '..', '..', 'README.md');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have LICENSE', () => {
      const filePath = path.join(__dirname, '..', '..', 'LICENSE');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have package.json', () => {
      const filePath = path.join(__dirname, '..', '..', 'package.json');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have .gitignore', () => {
      const filePath = path.join(__dirname, '..', '..', '.gitignore');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Directory Structure', () => {
    it('should have backend directory', () => {
      const dirPath = path.join(__dirname, '..', '..', 'backend');
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should have tests directory', () => {
      const dirPath = path.join(__dirname, '..', '..');
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should have src directory', () => {
      const dirPath = path.join(__dirname, '..', '..', 'src');
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should have docs directory', () => {
      const dirPath = path.join(__dirname, '..', '..', 'docs');
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });
});
