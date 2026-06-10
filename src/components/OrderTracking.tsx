'use client';

/**
 * OrderTracking — reusable visual progress stepper.
 * Shows the order lifecycle from "Order placed" → "Delivered"
 * with completed stages highlighted in green.
 *
 * Props:
 *   currentStatus  — the order's current status string
 *   isCancelled    — if true, shows a red "Cancelled" banner instead
 */

import React from 'react';
import { ORDER_STATUS_FLOW, COLORS } from '@/constants/styles';

interface OrderTrackingProps {
  currentStatus: string;
  isCancelled?: boolean;
}

const getStepColor = (idx: number) => {
  switch (idx) {
    case 0: return COLORS.primary; // Yellow
    case 1: return '#3b82f6'; // Blue
    case 2: return '#f97316'; // Orange
    case 3: return '#a855f7'; // Purple
    case 4: return COLORS.heading; // Green
    default: return COLORS.primary;
  }
};

export default function OrderTracking({ currentStatus, isCancelled }: OrderTrackingProps) {
  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
        <i className="fa-solid fa-circle-xmark text-red-400 text-xl" />
        <div>
          <p className="font-bold text-red-600 text-sm">Order Cancelled</p>
          <p className="text-xs text-red-400 mt-0.5">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIdx = ORDER_STATUS_FLOW.indexOf(currentStatus as any);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        Order Progress
      </p>

      {/* Desktop — horizontal stepper */}
      <div className="hidden sm:flex items-center">
        {ORDER_STATUS_FLOW.map((step, idx) => {
          const done = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const isLast = idx === ORDER_STATUS_FLOW.length - 1;
          const stepColor = getStepColor(idx);

          return (
            <React.Fragment key={step}>
              {/* Step node */}
              <div className="flex flex-col items-center flex-shrink-0 min-w-[56px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-bold
                    ${done ? 'shadow-md' : ''}
                  `}
                  style={{
                    backgroundColor: done ? stepColor : '#f3f4f6',
                    color: done ? '#fff' : '#9ca3af',
                    boxShadow: isCurrent ? `0 0 0 2px white, 0 0 0 4px ${stepColor}` : 'none'
                  }}
                >
                  {done ? <i className="fa-solid fa-check text-[10px]" /> : idx + 1}
                </div>
                <p
                  className="text-[9px] mt-1.5 font-bold text-center leading-tight max-w-[52px]"
                  style={{ color: done ? stepColor : '#d1d5db' }}
                >
                  {step}
                </p>
              </div>

              {/* Connector */}
              {!isLast && (
                <div
                  className="flex-1 h-1 rounded-full mx-1 mb-4 transition-all duration-300"
                  style={{ backgroundColor: idx < currentIdx ? stepColor : '#f3f4f6' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile — vertical stepper */}
      <div className="flex sm:hidden flex-col gap-0">
        {ORDER_STATUS_FLOW.map((step, idx) => {
          const done = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const isLast = idx === ORDER_STATUS_FLOW.length - 1;
          const stepColor = getStepColor(idx);

          return (
            <div key={step} className="flex items-stretch gap-4">
              {/* Left: dot + line */}
              <div className="flex flex-col items-center w-6">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: done ? stepColor : '#f3f4f6',
                    color: done ? '#fff' : '#9ca3af',
                    boxShadow: isCurrent ? `0 0 0 2px white, 0 0 0 4px ${stepColor}` : 'none'
                  }}
                >
                  {done ? <i className="fa-solid fa-check text-[8px]" /> : idx + 1}
                </div>
                {!isLast && (
                  <div
                    className="w-0.5 flex-1 my-1 rounded-full"
                    style={{ backgroundColor: idx < currentIdx ? stepColor : '#e5e7eb', minHeight: '20px' }}
                  />
                )}
              </div>

              {/* Right: label */}
              <div className={`pb-4 ${isLast ? '' : ''}`}>
                <p
                  className={`text-xs font-bold leading-none mt-1 ${done ? 'text-gray-800' : 'text-gray-300'}`}
                >
                  {step}
                </p>
                {isCurrent && (
                  <p className="text-[10px] mt-1 font-semibold" style={{ color: stepColor }}>
                    Current status
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
