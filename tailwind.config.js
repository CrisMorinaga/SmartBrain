/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'project-blue': '#0F172A',
                'project-lighter-magenta': '#513043',
                'project-magenta': '#A75184',
                'project-pale-silver': '#D8C4B6',
                'project-light-blue': '#38BCF8',
                'project-boxes': '#1E293B',
                'project-boxes-border': '#35404F',
                'project-text-color': '#D3DAE3'
                
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
