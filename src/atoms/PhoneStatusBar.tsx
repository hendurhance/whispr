import React from 'react';

interface PhoneStatusBarProps {
    time?: string;
    isDark?: boolean;
    className?: string;
}

const randomTime = () => {
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${hours}:${minutes}` + (Math.random() < 0.5 ? ' AM' : ' PM');
};

const PhoneStatusBar: React.FC<PhoneStatusBarProps> = ({
    time = randomTime(),
    isDark = false,
    className = ''
}) => {
    const textColor = isDark ? 'text-text-muted' : 'text-white opacity-80';

    return (
        <div className={`p-4 flex justify-between items-center ${className}`}>
            <span className={`text-xs ${textColor}`}>{time}</span>
            <div className="flex gap-1 items-center">
                <span className={`block w-2 h-2 rounded-full ${isDark ? 'bg-text-muted' : 'bg-white opacity-80'}`}></span>
                <span className={`block w-2 h-2 rounded-full ${isDark ? 'bg-text-muted' : 'bg-white opacity-80'}`}></span>
            </div>
        </div>
    );
};

export default PhoneStatusBar;