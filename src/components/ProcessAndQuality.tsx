import React from 'react';
import { Sprout, Microscope, PackageCheck, Ship, CheckCircle2 } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/productsData';

export const ProcessAndQuality: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Direct Farm Procurement',
      desc: 'We partner directly with certified organic farmer collectives in Pollachi, Nilgiris, and Wayanad, ensuring pesticide-free harvest under strict fair trade guidelines.',
      icon: Sprout,
      color: 'text-[#2D5A27]',
      borderHover: 'hover:border-[#2D5A27]'
    },
    {
      step: '02',
      title: 'Lab Testing & Optical Sorting',
      desc: 'Every batch undergoes multi-spectrum optical Sortex grading and NABL-accredited laboratory residue tests for aflatoxins, heavy metals, and moisture.',
      icon: Microscope,
      color: 'text-[#FF8C00]',
      borderHover: 'hover:border-[#FF8C00]'
    },
    {
      step: '03',
      title: 'Custom Barrier Packaging',
      desc: 'Packaged in nitrogen-flushed bags, vacuum pouches, or UV-treated leno mesh containers designed to withstand humidity fluctuations across ocean voyages.',
      icon: PackageCheck,
      color: 'text-sky-400',
      borderHover: 'hover:border-sky-400'
    },
    {
      step: '04',
      title: 'Cold-Chain Port Dispatch',
      desc: 'Loaded into digitally monitored reefer containers at Tuticorin & Cochin ports with continuous temperature logs, swift customs clearance, and FOB/CIF delivery.',
      icon: Ship,
      color: 'text-emerald-400',
      borderHover: 'hover:border-emerald-400'
    }
  ];

  return (
    <section id="quality" className="py-20 lg:py-24 bg-[#001233] text-white relative overflow-hidden font-body border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Section Title (Editorial) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#FF8C00] font-heading font-semibold tracking-widest text-xs uppercase mb-3 block">
            Quality Assurance Protocol
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            From Southern Indian Soil to <span className="text-[#FF8C00] italic font-serif">Global Ports</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 font-body max-w-2xl mx-auto">
            Our end-to-end export protocol guarantees 100% freshness, zero spoilage, and full international phytosanitary compliance.
          </p>
          <div className="w-12 h-1 bg-[#FF8C00] mx-auto mt-4 rounded-full" />
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                id={`process-step-${idx}`}
                className="p-6 rounded-lg bg-white/5 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="font-heading text-xl font-bold text-gray-500">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed font-body">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-[#2D5A27]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Quality Assurance Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Trade Ports Banner */}
        <div className="mt-12 p-6 rounded-lg bg-white/5 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h4 className="font-heading text-base font-bold text-white flex items-center justify-center lg:justify-start gap-2">
              <span>⚓ Primary Ocean Freight Ports of Loading</span>
            </h4>
            <p className="text-xs text-gray-300 font-body">
              Direct container berthing with short turnaround times to Middle Eastern, European, and Asian hub ports.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {COMPANY_DETAILS.exportPorts.map((port, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded bg-white/10 text-white text-xs font-heading font-bold uppercase tracking-wider border border-white/10"
              >
                {port}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
