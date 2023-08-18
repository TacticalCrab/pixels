import React, {useEffect, useState} from 'react';

const timeToText = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

interface useTextTimerReturn {
    TextTimer: () => React.JSX.Element,
    setTimerDeadline: (deadline: number) => void,
    timerRunning: boolean
}

export default function useTextTimer(): useTextTimerReturn {
    const [timerText, setTimerText] = useState('00:00:00');
    const [deadline, setDeadline] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        const timerIntervalCallback = (onEnd?: () => void) => {
            const deadlineDiff =  deadline - Date.now();

            if (deadlineDiff <= 0) {
                setTimerText(timeToText(0));
                setTimerRunning(false);
                onEnd?.();

                return;
            }

            setTimerText(timeToText(deadlineDiff));
            setTimerRunning(true);
        }
        timerIntervalCallback()
        const timerInterval = setInterval(() => {
            timerIntervalCallback(() => {
                clearInterval(timerInterval);
            });
        }, 300)

        return () => clearInterval(timerInterval);
    }, [deadline]);

    const TextTimer = () => {
        return (
            <div className={'text-black'}>
                {timerText}
            </div>
        )
    }
    return {
        TextTimer,
        setTimerDeadline: (deadline: number) => {
            setDeadline(Date.now() + deadline * 1000);
        },
        timerRunning
    }
}