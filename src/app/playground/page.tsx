'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PlaygroundPage() {
  const [red, setRed] = useState(0)
  const [green, setGreen] = useState(0)
  const [blue, setBlue] = useState(0)
  const [fontSize, setFontSize] = useState(1)
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif')

  const rgbColor = `rgb(${red}, ${green}, ${blue})`
  const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`

  const fonts = [
    'Arial, sans-serif',
    'Helvetica Neue, Arial, sans-serif',
    'Times New Roman, Times, serif',
    'Courier New, Courier, monospace',
    'system-ui, -apple-system, sans-serif',
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Poppins, sans-serif',
    'Fira Code, monospace'
  ]

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-primary hover:text-primary/80">
                ← Back
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎨</span>
                <h1 className="text-3xl font-bold text-primary">Color & Font Playground</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls */}
          <div className="space-y-6">
            <div className="command-card">
              <h2 className="text-xl font-semibold mb-4">🎨 Color Controls</h2>
              
              {/* RGB Sliders */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Red: {red}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={red}
                      onChange={(e) => setRed(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                      style={{background: `linear-gradient(to right, rgb(0,${green},${blue}), rgb(255,${green},${blue}))`}}
                    />
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={red}
                      onChange={(e) => setRed(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Green: {green}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={green}
                      onChange={(e) => setGreen(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                      style={{background: `linear-gradient(to right, rgb(${red},0,${blue}), rgb(${red},255,${blue}))`}}
                    />
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={green}
                      onChange={(e) => setGreen(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Blue: {blue}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={blue}
                      onChange={(e) => setBlue(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      style={{background: `linear-gradient(to right, rgb(${red},${green},0), rgb(${red},${green},255))`}}
                    />
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={blue}
                      onChange={(e) => setBlue(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Color Values */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">RGB:</span>
                  <code className="bg-white px-2 py-1 rounded text-sm">{rgbColor}</code>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">HEX:</span>
                  <code className="bg-white px-2 py-1 rounded text-sm">{hexColor.toUpperCase()}</code>
                </div>
              </div>
            </div>

            <div className="command-card">
              <h2 className="text-xl font-semibold mb-4">🔤 Font Controls</h2>
              
              {/* Font Family */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {fonts.map((font) => (
                    <option key={font} value={font}>
                      {font.split(',')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Font Size: {fontSize}rem ({fontSize * 16}px)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.125"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5rem</span>
                  <span>2rem</span>
                  <span>4rem</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="command-card">
              <h2 className="text-xl font-semibold mb-4">👁️ Live Preview</h2>
              
              {/* Color Swatch */}
              <div className="mb-6">
                <div 
                  className="w-full h-32 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: rgbColor }}
                ></div>
              </div>

              {/* Text Preview */}
              <div className="space-y-4">
                <div
                  style={{
                    color: rgbColor,
                    fontFamily: fontFamily,
                    fontSize: `${fontSize}rem`
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
                
                <div
                  style={{
                    color: rgbColor,
                    fontFamily: fontFamily,
                    fontSize: `${fontSize}rem`,
                    fontWeight: 'bold'
                  }}
                >
                  Bold text example
                </div>

                <div
                  style={{
                    color: rgbColor,
                    fontFamily: fontFamily,
                    fontSize: `${fontSize * 0.875}rem`
                  }}
                >
                  Smaller text for comparison
                </div>
              </div>
            </div>

            <div className="command-card">
              <h2 className="text-xl font-semibold mb-4">📋 CSS Code</h2>
              <div className="space-y-3">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div>color: {rgbColor};</div>
                  <div>font-family: {fontFamily};</div>
                  <div>font-size: {fontSize}rem;</div>
                </div>
                
                <button
                  onClick={() => {
                    const css = `color: ${rgbColor};\nfont-family: ${fontFamily};\nfont-size: ${fontSize}rem;`
                    navigator.clipboard.writeText(css)
                  }}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  📋 Copy CSS
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
