const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/bulk/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const searchStr = '{/* ── Bulk Order Form ── */}';
const injection = `            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Why Partner With Us ── */}
            <div className={COLORS.bg}>
                <WhyPartnerWithUsSection />
            </div>

            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Our Grades ── */}
            <div className={COLORS.bg}>
                <OurGradesSection onEnquire={scrollToForm} onSelectCheck={onSelectCheck} />
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-12">
                <WhiteLabelBanner />
            </div>

            `;

content = content.replace(searchStr, injection + searchStr);
fs.writeFileSync(file, content, 'utf8');
console.log('Restored missing components safely.');
