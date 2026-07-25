const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

walk('src').forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    // We are looking for: fetch(${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/...
    // Note: the literal string currently in files is exactly: 
    // fetch(${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/
    
    // First, fix the start:
    c = c.replace(/fetch\(\$\{import\.meta\.env\.PROD \? 'https:\/\/kavachx-6wm9\.onrender\.com' : ''\}\/api\//g, 'fetch(`\\${import.meta.env.PROD ? \\\'https://kavachx-6wm9.onrender.com\\\' : \\\'\\\'}/api/');
    
    // Now fix the end of those strings. They end in either ', { or ')
    // But since they are now backticks, we have to find them.
    // Actually, I can just use a regex for the whole URL:
    // Any URL that starts with fetch(`${import...` and ends with a single quote ', needs that quote turned to `
    c = c.replace(/fetch\(\`(\\\$\{import\.meta\.env\.PROD \? 'https:\/\/kavachx-6wm9\.onrender\.com' : ''\}\/api\/[^']*)'/g, 'fetch(`$1`');
    
    fs.writeFileSync(f, c);
});
