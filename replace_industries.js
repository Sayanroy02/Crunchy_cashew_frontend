const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/bulk/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    '<section className="max-w-6xl mx-auto px-6 py-10 md:py-16">',
    '<section className="max-w-7xl mx-auto px-6 py-10 md:py-16">'
);

content = content.replace(
    'text="Who We"',
    'text="Industries We"'
);

content = content.replace(
    'highlight="Serve"',
    'highlight="Supply"'
);

content = content.replace(
    'Trusted by businesses across India — from neighborhood stores to global hospitality giants.',
    'Consistent quality and reliable volume for businesses of all sizes.'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced successfully');
