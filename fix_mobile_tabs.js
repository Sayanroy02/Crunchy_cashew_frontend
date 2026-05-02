const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/bulk/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `            {/* Tab Navigation */}
            <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-3 mb-8 pb-4 no-scrollbar -mx-6 px-6 md:mx-0">
                {gradeCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={\`group flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all duration-300 text-sm shadow-sm border \${activeTab === cat.id
                            ? 'bg-[#F6B000] text-black border-[#F6B000]'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-[#F6B000] hover:text-gray-900'
                            }\`}
                    >
                        <span className={\`\${activeTab === cat.id ? 'text-black' : 'text-gray-400 group-hover:text-[#F6B000]'}\`}>
                            {cat.icon}
                        </span>
                        {cat.title}
                    </button>
                ))}
            </div>`;

// Use regex to be more forgiving with whitespace/newlines
const regex = /\s*\{\/\* ── Tab Navigation ── \*\/\}\s*<div.*?<\/div>/s; // Wait, it's {/* Tab Navigation */}

const oldBlock = content.substring(content.indexOf('{/* Tab Navigation */}'), content.indexOf('</div>', content.indexOf('{/* Tab Navigation */}')) + 6);

const newBlock = `{/* Tab Navigation */}
            <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-3 mb-8 pb-4 no-scrollbar -mx-6 px-6 md:mx-0">
                {gradeCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={\`group flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-300 text-sm shadow-sm border \${
                            activeTab === cat.id
                            ? 'bg-[#F6B000] text-black border-[#F6B000] px-5 md:px-6 py-3'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-[#F6B000] hover:text-gray-900 px-4 md:px-6 py-3'
                            }\`}
                    >
                        <span className={\`\${activeTab === cat.id ? 'text-black' : 'text-gray-400 group-hover:text-[#F6B000]'}\`}>
                            {cat.icon}
                        </span>
                        <span className={\`\${activeTab === cat.id ? 'block' : 'hidden md:block'}\`}>
                            {cat.title}
                        </span>
                    </button>
                ))}
            </div>`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(file, content, 'utf8');
console.log('Mobile tabs updated successfully.');
