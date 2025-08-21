import { Square, SquareAsterisk, SquareDot, SquareEqual, SquarePen, SquareM } from 'lucide-react';

// Defines the color themes for subject cards for better visual distinction.
export const colorThemes = {
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', shadow: 'hover:shadow-teal-500/20', text: 'text-teal-300' },
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', shadow: 'hover:shadow-sky-500/20', text: 'text-sky-300' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', shadow: 'hover:shadow-purple-500/20', text: 'text-purple-300' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', shadow: 'hover:shadow-rose-500/20', text: 'text-rose-300' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', shadow: 'hover:shadow-amber-500/20', text: 'text-amber-300' },
    lime: { bg: 'bg-lime-500/10', border: 'border-lime-500/30', shadow: 'hover:shadow-lime-500/20', text: 'text-lime-300' },
};

// Defines unique icons and colors for each grade level.
export const gradeStyles = {
    p1: { icon: Square, color: 'text-rose-400' },
    p2: { icon: SquareDot, color: 'text-orange-400' },
    p3: { icon: SquarePen, color: 'text-amber-400' },
    p4: { icon: SquareAsterisk, color: 'text-lime-400' },
    p5: { icon: SquareEqual, color: 'text-sky-400' },
    p6: { icon: SquareM, color: 'text-purple-400' },
};
export const grades = Object.keys(gradeStyles);
