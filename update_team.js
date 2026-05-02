const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/about/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /if \(activeTab === 'team'\) return \([\s\S]*?    \);/m;

const newCode = `if (activeTab === 'team') return (
      <div className="about-animate">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Column */}
            <div className="w-full relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                    src="/images/nitesh.png" 
                    alt="Nitesh Jindal - Founder" 
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Text Column */}
            <div className="flex flex-col justify-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-6 w-fit">
                    <span className="w-2 h-2 rounded-full bg-black"></span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">The Owner's Note</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900 mb-8 leading-tight">
                    A Commitment to Uncompromising Quality.
                </h2>
                
                <div className="space-y-5 text-gray-600 text-sm md:text-base leading-relaxed mb-10 relative">
                    <div className="absolute -top-6 -left-4 text-8xl text-gray-100 font-serif leading-none select-none -z-10">"</div>
                    <p>
                        When I established Yu Nut Processing Industry in Siliguri, my goal wasn't just to enter the cashew market—it was to elevate it. I saw an opportunity to bring better technology, stricter quality controls, and a more ethical supply chain to the Indian B2B landscape.
                    </p>
                    <p>
                        Today, from personally overseeing our raw material sourcing from Africa to implementing data-driven production standards on our factory floor, my focus remains the same: ensuring that every batch of Crunchy Cashews that leaves our facility represents the pinnacle of taste, nutrition, and reliability.
                    </p>
                    <p className="font-medium text-gray-800">
                        When you partner with us, you aren't just buying cashews; you are trusting my team's dedication to your business's success.
                    </p>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <div className="mb-1" style={{ fontFamily: "'Brush Script MT', 'Great Vibes', cursive", fontSize: '2.5rem', color: '#111' }}>
                        Nitesh Jindal
                    </div>
                    <p className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">
                        Nitesh Jindal
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#F6B000' }}>
                        Managing Director & Proprietor,
                        <br/>Yu Nut Processing Industry
                    </p>
                </div>
            </div>
        </div>
      </div>
    );`;

if(content.match(regex)) {
    content = content.replace(regex, newCode);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully replaced the Our Team section.");
} else {
    console.log("Could not find the target section to replace.");
}
