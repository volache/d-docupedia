const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'src/pages/Article.tsx',
    rules: [
      { from: /from '\.\/layouts\//g, to: "from '../layouts/" }
    ]
  },
  {
    file: 'src/pages/admin/ArticleManager.tsx',
    rules: [
      { from: /from '\.\.\/layouts\//g, to: "from '../../layouts/" }
    ]
  },
  {
    file: 'src/pages/Faq.tsx',
    rules: [
      { from: /from '\.\/ui'/g, to: "from '../components/ui'" }
    ]
  },
  {
    file: 'src/pages/Workflow.tsx',
    rules: [
      { from: /from '\.\/ui'/g, to: "from '../components/ui'" }
    ]
  },
  {
    file: 'src/layouts/GuideLayout.tsx',
    rules: [
      { from: /from '\.\.\/ArticleBlocks'/g, to: "from '../components/article/ArticleBlocks'" }
    ]
  },
  {
    file: 'src/layouts/ExampleLayout.tsx',
    rules: [
      { from: /from '\.\.\/ArticleBlocks'/g, to: "from '../components/article/ArticleBlocks'" }
    ]
  },
  {
    file: 'src/layouts/FaqLayout.tsx',
    rules: [
      { from: /from '\.\.\/ArticleBlocks'/g, to: "from '../components/article/ArticleBlocks'" }
    ]
  },
  {
    file: 'src/layouts/SystemTutorialLayout.tsx',
    rules: [
      { from: /from '\.\.\/ArticleBlocks'/g, to: "from '../components/article/ArticleBlocks'" }
    ]
  },
  {
    file: 'src/layouts/WorkflowLayout.tsx',
    rules: [
      { from: /from '\.\.\/ArticleBlocks'/g, to: "from '../components/article/ArticleBlocks'" }
    ]
  },
  {
    file: 'src/layouts/AdminLayout.tsx',
    rules: [
      { from: /from '\.\/AdminSidebar'/g, to: "from '../pages/admin/AdminSidebar'" }
    ]
  }
];

replacements.forEach(({ file, rules }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    rules.forEach(rule => {
      content = content.replace(rule.from, rule.to);
    });
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No changes needed in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
