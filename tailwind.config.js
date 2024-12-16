import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				text: 'hsl(var(--text))',
				primary: {
					DEFAULT: 'hsl(var(--primary))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))'
				}
			},
			borderRadius: {
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: 'calc(var(--radius) - 4px)'
			},
			scale: {
				hover: '1.03'
			},
			fontFamily: {
				sans: ['Outfit', 'sans-serif'],
				serif: ['Regatto']
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [tailwindcssAnimate]
};
