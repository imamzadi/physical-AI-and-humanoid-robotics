#!/usr/bin/env node

// Content validation script for Physical AI & Humanoid Robotics Textbook
// Validates content against constitution requirements

const fs = require('fs');
const path = require('path');

// Check if running from project root
const docsPath = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsPath)) {
  console.error('Error: docs directory not found. Please run this script from the project root.');
  process.exit(1);
}

// Function to check if a file has required frontmatter
function validateFrontmatter(content, filePath) {
  const requiredFields = ['id', 'title', 'sidebar_label', 'sidebar_position', 'description'];
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    console.error(`❌ ${filePath}: Missing frontmatter`);
    return false;
  }

  const frontmatter = frontmatterMatch[1];
  const errors = [];

  for (const field of requiredFields) {
    if (!frontmatter.includes(field + ':')) {
      errors.push(field);
    }
  }

  if (errors.length > 0) {
    console.error(`❌ ${filePath}: Missing required frontmatter fields: ${errors.join(', ')}`);
    return false;
  }

  return true;
}

// Function to check if a file has proper admonitions
function validateAdmonitions(content, filePath) {
  // Check for proper admonition syntax
  const hasAdmonitions = /:::note[\s\S]*?:::|:::tip[\s\S]*?:::|:::warning[\s\S]*?:::|:::danger[\s\S]*?:::/g.test(content);

  if (!hasAdmonitions) {
    console.warn(`⚠️  ${filePath}: No admonitions found (this may be acceptable for some pages)`);
    return true; // Don't fail validation for missing admonitions
  }

  return true;
}

// Function to check for LaTeX equations
function validateLatex(content, filePath) {
  // Check for LaTeX syntax
  const hasLatex = /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g.test(content);

  if (!hasLatex && filePath.includes('module-3')) {
    console.warn(`⚠️  ${filePath}: No LaTeX equations found (expected in AI-Robot Brain module)`);
  }

  return true;
}

// Walk through all markdown files in docs directory
function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath, callback);
    } else if (file.endsWith('.md')) {
      callback(filePath);
    }
  }
}

// Main validation process
let totalFiles = 0;
let validFiles = 0;

console.log('🔍 Validating Physical AI & Humanoid Robotics Textbook content...\n');

walkDirectory(docsPath, (filePath) => {
  totalFiles++;

  const content = fs.readFileSync(filePath, 'utf8');
  let fileValid = true;

  // Run all validation checks
  fileValid = validateFrontmatter(content, filePath) && fileValid;
  fileValid = validateAdmonitions(content, filePath) && fileValid;
  fileValid = validateLatex(content, filePath) && fileValid;

  if (fileValid) {
    validFiles++;
    console.log(`✅ ${filePath.replace(process.cwd(), '')}`);
  }
});

console.log(`\n📊 Validation Summary:`);
console.log(`Total files checked: ${totalFiles}`);
console.log(`Valid files: ${validFiles}`);
console.log(`Invalid files: ${totalFiles - validFiles}`);

if (totalFiles === validFiles) {
  console.log('\n🎉 All content files passed validation!');
  process.exit(0);
} else {
  console.log('\n❌ Some content files failed validation.');
  process.exit(1);
}