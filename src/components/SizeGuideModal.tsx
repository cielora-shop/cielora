import React, { useState } from 'react';
import Image from 'next/image';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = ['BRACELETS', 'RINGS', 'NECKLACES', 'EARRINGS', 'WATCHES'];

const NecklaceBust = ({ unit, lengths }: { unit: 'cm' | 'inches', lengths: number[] }) => (
  <div className="flex flex-col items-center w-full max-w-[220px]">
    <svg viewBox="0 0 200 320" className="w-full h-auto drop-shadow-sm">
      {/* Bust Silhouette */}
      <path 
        d="M 65,0 C 65,40 65,60 40,85 C 10,110 5,150 15,300 Q 100,320 185,300 C 195,150 190,110 160,85 C 135,60 135,40 135,0 Z" 
        fill="#b3b3b3" 
      />
      {/* Top collar line */}
      <ellipse cx="100" cy="10" rx="35" ry="10" fill="#e5e5e5" />
      
      {/* Necklaces and Labels */}
      {lengths.map((len, index) => {
        const dropY = 75 + (index * 23);
        const controlY = (dropY - 25) * 2;
        return (
          <g key={len}>
            <path 
              d={`M 70 50 Q 100 ${controlY} 130 50`} 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="1.5" 
            />
            <circle cx="100" cy={dropY} r="11" fill="#ffffff" stroke="#e5e5e5" strokeWidth="1" />
            <text 
              x="100" 
              y={dropY + 3.5} 
              fontSize="10" 
              fontWeight="bold" 
              textAnchor="middle" 
              fill="#000000"
            >
              {len}
            </text>
          </g>
        );
      })}
    </svg>
    <span className="mt-4 text-[14px] text-gray-700 font-medium">{unit}</span>
  </div>
);

const EarringSVG = ({ cm, inches, pixelHeight }: { cm: string, inches: string, pixelHeight: number }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-36 md:w-20 md:h-44 relative">
      <svg viewBox="0 0 80 180" className="w-full h-full overflow-visible">
        {/* Ear line drawing */}
        <path d="M 20,120 Q 30,130 35,135 Q 45,150 55,135 C 70,110 75,80 65,40 C 50,0 15,0 10,40 C 5,65 15,80 30,95 Q 40,105 30,120" fill="none" stroke="#a3a3a3" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 20,50 Q 35,25 55,45 Q 65,70 55,105" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
        <path d="M 35,60 Q 45,60 45,75 Q 45,90 35,80" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
        
        {/* Earring Rectangle */}
        <rect 
          x="42" 
          y="128" 
          width="8" 
          height={pixelHeight} 
          fill="#ffffff" 
          stroke="#444444" 
          strokeWidth="1.5" 
        />
      </svg>
    </div>
    <div className="mt-4 text-center whitespace-nowrap">
      <div className="text-[10px] md:text-[11px] font-medium text-gray-800">{cm}cm / {inches}inch</div>
    </div>
  </div>
);

const WatchSVG = () => (
  <div className="flex justify-center my-10">
    <svg viewBox="0 0 200 200" className="w-56 h-56 md:w-72 md:h-72 drop-shadow-sm">
      {/* Watch Band */}
      <path 
        d="M 60,60 C -10,80 -10,180 80,180 C 140,180 200,160 180,90 Z"
        fill="none" 
        stroke="#b3b3b3" 
        strokeWidth="22" 
      />
      
      {/* Refined Watch Band Oval (outer ring base) */}
      <ellipse cx="100" cy="110" rx="75" ry="65" fill="none" stroke="#b3b3b3" strokeWidth="20" />
      
      {/* Watch Face block at the top */}
      <path d="M 65,40 C 65,30 135,30 135,40 L 140,65 L 60,65 Z" fill="#b3b3b3" />
      <circle cx="100" cy="48" r="12" fill="#ffffff" />

      {/* Buckle detailing at bottom */}
      <path d="M 80,172 L 115,172 L 115,188 L 80,188 Z" fill="#b3b3b3" />
      <path d="M 120,162 L 132,162 L 132,192 L 120,192 Z" fill="#b3b3b3" />
      <circle cx="95" cy="180" r="4" fill="#a3a3a3" />
      
      {/* Inner dotted line oval */}
      <ellipse cx="100" cy="115" rx="55" ry="40" fill="none" stroke="#000000" strokeWidth="2" strokeDasharray="5,4" />
      
      {/* Arrow Head */}
      <polygon points="155,106 161,117 149,117" fill="#000000" />
    </svg>
  </div>
);

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState('BRACELETS');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/40 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full md:w-[550px] lg:w-[600px] h-full overflow-hidden shadow-2xl flex flex-col relative"
        style={{ animation: 'slideInRight 0.35s ease-out forwards' }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 shrink-0 bg-white">
          <h2 className="text-[16px] font-bold text-black">Size & Fit Guide</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Fixed Title & Tabs Area */}
        <div className="px-4 md:px-6 pt-6 shrink-0 bg-white">
          <h3 className="text-[15px] font-semibold text-black mb-3">Size Guide</h3>

          {/* Tabs */}
          <div className="flex border-b border-gray-300 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[13px] font-medium tracking-wide transition-colors whitespace-nowrap border-b-2 ${activeTab === tab
                    ? 'border-[#b7412d] text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Tab Content Area */}
        <div className="px-4 md:px-6 py-6 md:py-8 flex-grow overflow-y-auto">

          {/* Tab Content */}
          {activeTab === 'BRACELETS' && (
            <div className="flex flex-col animate-fadeIn">
              <p className="text-[14px] text-gray-800 mb-3 leading-relaxed">
                To find out the size of your bracelet, wrap a piece of tape around your wrist and write down the measurement.
              </p>
              <p className="text-[14px] text-gray-800 mb-10 leading-relaxed">
                The range of sizes within each size is due to the craftsmanship of our jewellery.
              </p>

              <div className="flex justify-center mb-6 md:mb-10">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image
                    src="/images/bracelet-measure.png"
                    alt="Bracelet measurement guide"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="overflow-x-auto w-full mb-8">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black">SIZE</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">CIRCUMFERENCE (cm)</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">CIRCUMFERENCE (in)</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] md:text-[13px] text-gray-800">
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">S</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">14,6 - 15,5 cm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">5,7 - 6,1 in</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">M</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">15,6 - 16,5 cm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">6,1 - 6,5 in</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">L</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">16,6 - 17,5 cm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">6,5 - 6,8 in</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">XL</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">17,6 - 18,5 cm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">6,9 - 7,2 in</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">XXL</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">18,6 - 20,5 cm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">7,3 - 8 in</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'RINGS' && (
            <div className="flex flex-col animate-fadeIn">
              <p className="text-[14px] text-gray-800 mb-1 leading-relaxed">
                To find out the right size for your ring, you can do this in the following two ways:
              </p>
              <ul className="list-disc pl-5 text-[14px] text-gray-800 mb-4 space-y-1">
                <li>Use a well-fitting ring to measure the diameter (from one end of the ring to the other).</li>
                <li>Measure the circumference of your finger with a tape or string.</li>
              </ul>

              <p className="text-[14px] text-gray-800 mb-1 leading-relaxed">
                Consult the corresponding table to find out which size corresponds to your measurement.
              </p>
              <p className="text-[14px] text-gray-800 mb-8 leading-relaxed">
                The range of sizes within each size is due to the craftsmanship of our jewellery.
              </p>

              <h4 className="text-[16px] font-semibold text-black mb-6">Diameter</h4>

              <div className="flex justify-center mb-6 md:mb-10">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image
                    src="/images/ring-diameter.png"
                    alt="Ring diameter measurement guide"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="overflow-x-auto w-full mb-12">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black">SIZE</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">US</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">UK</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">DIAMETER mm</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">DIAMETER in</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] md:text-[13px] text-gray-800">
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">9</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">4.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">I 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">15.3 - 15.6 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">0.60 in</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">12</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">6</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">L 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">16.3 - 16.8 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">0.65 in</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">15</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">7.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">O 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">17.2 - 17.7 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">0.69 in</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">18</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">8.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">Q 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">18.2 - 18.5 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">0.73 in</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">21</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">9.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">S 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">19.2 - 19.4 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">0.76 in</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">23</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">10.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">U 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">19.9 - 20.1 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">0.79 in</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-[16px] font-semibold text-black mb-6">Circumference</h4>

              <div className="flex justify-center mb-6 md:mb-10">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image
                    src="/images/ring-circumference.png"
                    alt="Ring circumference measurement guide"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="overflow-x-auto w-full mb-8">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black">SIZE</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">US</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">UK</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">CIRCUMFERENCE mm</th>
                      <th className="bg-black text-white text-[10px] md:text-[12px] font-bold py-3 px-2 md:px-4 border border-black border-l-gray-600">CIRCUMFERENCE in</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] md:text-[13px] text-gray-800">
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">9</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">4.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">I 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">48.6 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">1.9 in</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">12</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">6</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">L 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">51.8 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">2.0 in</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">15</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">7.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">O 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">54.8 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">2.2 in</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">18</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">8.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">Q 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">58.9 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">2.3 in</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">21</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">9.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">S 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">60.8 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">2.4 in</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">23</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">10.5</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">U 1/2</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">63.0 mm</td>
                      <td className="border border-gray-200 py-2 md:py-3 px-2 md:px-4">2.5 in</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'NECKLACES' && (
            <div className="flex flex-col animate-fadeIn">
              <p className="text-[14px] text-gray-800 mb-1 leading-relaxed">
                The size of a collar is calculated on the basis of its length, i.e. what it measures from one end to the other extended. Many collars are adjustable, so you can adjust the size to your liking by taking into account the minimum and maximum length specified in the more information section on each product page.
              </p>
              <p className="text-[14px] text-gray-800 mb-4 leading-relaxed">
                If the necklace has a bead, its size is not included in the minimum and maximum size.
              </p>
              <p className="text-[14px] text-gray-800 mb-1 leading-relaxed">
                To find the ideal size for your necklace you can do it in the following way:
              </p>
              <ul className="list-disc pl-5 text-[14px] text-gray-800 mb-8 space-y-1">
                <li>Measure a necklace you own from one end of the clasp to the other, on a flat surface.</li>
                <li>Place a piece of tape around the neck, tighten it and note the measurement.</li>
              </ul>

              <div className="flex flex-row flex-wrap justify-center items-start gap-8 md:gap-16 mb-8 w-full">
                <NecklaceBust 
                  unit="cm" 
                  lengths={[35, 40, 45, 55, 65, 75, 85, 95, 105]} 
                />
                <NecklaceBust 
                  unit="inches" 
                  lengths={[14, 16, 18, 22, 26, 30, 33, 37, 41]} 
                />
              </div>
            </div>
          )}

          {activeTab === 'EARRINGS' && (
            <div className="flex flex-col animate-fadeIn">
              <p className="text-[14px] text-gray-800 mb-10 leading-relaxed">
                For earrings in the desired size, please refer to the length specified in the more information section on the product page and refer to the following image for guidance.
              </p>
              
              <div className="flex flex-row flex-wrap justify-center items-end gap-x-4 gap-y-12 md:gap-x-8 mb-12 w-full">
                <EarringSVG cm="0.6" inches="0.24" pixelHeight={8} />
                <EarringSVG cm="1.7" inches="0.67" pixelHeight={22} />
                <EarringSVG cm="2.5" inches="0.98" pixelHeight={33} />
                <EarringSVG cm="3" inches="1.18" pixelHeight={40} />
                <EarringSVG cm="4.5" inches="1.77" pixelHeight={60} />
                <EarringSVG cm="5.5" inches="2.17" pixelHeight={73} />
              </div>
            </div>
          )}

          {activeTab === 'WATCHES' && (
            <div className="flex flex-col animate-fadeIn">
              <p className="text-[14px] text-gray-800 mb-4 leading-relaxed">
                To find the right size for your watch, wrap a tape around your wrist and write down the measurement.
              </p>
              <p className="text-[14px] text-gray-800 mb-6 leading-relaxed">
                Please note that the strap of each watch is adjustable. Get the minimum and maximum size for each watch in the more product information section.
              </p>
              
              <WatchSVG />
            </div>
          )}

          {activeTab !== 'BRACELETS' && activeTab !== 'RINGS' && activeTab !== 'NECKLACES' && activeTab !== 'EARRINGS' && activeTab !== 'WATCHES' && (
            <div className="py-20 text-center text-gray-500 animate-fadeIn">
              Size guide for {activeTab.toLowerCase()} is coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
