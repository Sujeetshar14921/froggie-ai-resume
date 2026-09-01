import { Check, Palette, Pipette } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react'
import { ACCENT_COLORS } from '../constants/colors';

const ColorPicker = ({ selectedColor, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hexInput, setHexInput] = useState(selectedColor || "#3B82F6");
    const colorInputRef = useRef(null);

    const isPreset = useMemo(
        () => ACCENT_COLORS.some((c) => c.value.toLowerCase() === (selectedColor || "").toLowerCase()),
        [selectedColor]
    );

    const isValidHex = (val) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(val);

    const applyHex = (val) => {
        if (isValidHex(val)) {
            onChange(val);
        }
    };

    return (
        <div className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all px-3 py-1.5 rounded-lg cursor-pointer'>
                <Palette size={13} className="text-emerald-600" /> <span className="max-sm:hidden">Accent</span>
            </button>
            {isOpen && (
                <div className='w-60 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                    <div className='grid grid-cols-4 gap-2'>
                        {ACCENT_COLORS.map((color) => (
                            <div key={color.value} className='relative cursor-pointer group flex flex-col' onClick={() => { onChange(color.value); setHexInput(color.value); setIsOpen(false) }}>
                                <div className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors" style={{ backgroundColor: color.value }}>
                                </div>
                                {selectedColor === color.value && (
                                    <div className='absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center'>
                                        <Check className="size-5 text-white" />
                                    </div>
                                )}
                                <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>
                            </div>
                        ))}

                        {/* Custom color option */}
                        <div className='relative cursor-pointer group flex flex-col' onClick={() => colorInputRef.current?.click()}>
                            <div
                                className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors flex items-center justify-center"
                                style={{
                                    background: !isPreset && selectedColor
                                        ? selectedColor
                                        : "conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red)"
                                }}
                            >
                                {isPreset || !selectedColor ? (
                                    <Pipette className="size-4 text-white drop-shadow" />
                                ) : (
                                    <Check className="size-5 text-white drop-shadow" />
                                )}
                            </div>
                            <input
                                ref={colorInputRef}
                                type="color"
                                value={isValidHex(selectedColor) ? selectedColor : "#3B82F6"}
                                onChange={(e) => { setHexInput(e.target.value); onChange(e.target.value) }}
                                className="sr-only"
                            />
                            <p className='text-xs text-center mt-1 text-gray-600'>Custom</p>
                        </div>
                    </div>

                    {/* Manual hex entry */}
                    <div className='mt-3 pt-3 border-t border-gray-100 flex items-center gap-2'>
                        <span
                            className='size-6 rounded-full border border-gray-200 shrink-0'
                            style={{ backgroundColor: isValidHex(hexInput) ? hexInput : "transparent" }}
                        />
                        <input
                            type="text"
                            value={hexInput}
                            onChange={(e) => setHexInput(e.target.value)}
                            onBlur={() => applyHex(hexInput)}
                            onKeyDown={(e) => { if (e.key === "Enter") { applyHex(hexInput); e.currentTarget.blur() } }}
                            placeholder="#RRGGBB"
                            maxLength={7}
                            className='flex-1 min-w-0 text-xs px-2 py-1.5 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-400 text-gray-700'
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ColorPicker