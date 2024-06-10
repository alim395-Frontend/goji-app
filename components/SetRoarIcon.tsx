// components/SetRoarIcon.tsx
'use client'

import { useEffect } from 'react';
import { useRoarIcon } from '@/context/RoarIconContext';

interface SetRoarIconProps {
    roarIcon?: string;
}

const SetRoarIcon: React.FC<SetRoarIconProps> = ({ roarIcon = 'roar.svg' }) => {
    const { setRoarIcon } = useRoarIcon();

    useEffect(() => {
        const checkRoarIcon = async (icon: string) => {
            try {
                const response = await fetch(`/roarIcons/${icon}`);
                if (response.ok) {
                    setRoarIcon(icon);
                } else {
                    setRoarIcon('roar.svg');
                }
            } catch (error) {
                setRoarIcon('roar.svg');
            }
        };

        checkRoarIcon(roarIcon);

        // Cleanup function to reset the roarIcon when the component unmounts
        return () => {
            setRoarIcon('');
        };
    }, [roarIcon, setRoarIcon]);

    return null;
};

export default SetRoarIcon;