const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/about/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("{ id: 'team', label: 'Our Team' }", "{ id: 'team', label: 'Founder\\'s Note' }");
fs.writeFileSync(file, content, 'utf8');
console.log("Updated tab label.");
