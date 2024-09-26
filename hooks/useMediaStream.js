import { useState, useEffect, useRef } from 'react';

const useMediaStream = () => {
    const [state, setState] = useState(null);
    const isStreamSet = useRef(false);

    useEffect(() => {
        if (isStreamSet.current) return;
        isStreamSet.current = true;

        (async function initStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                });
                console.log("Stream initialized");
                setState(stream);
            } catch (e) {
                if (e.name === 'NotAllowedError') {
                    console.log("Permission denied for media access");
                } else if (e.name === 'NotFoundError') {
                    console.log("No media devices found");
                } else {
                    console.log("Error in media navigator:", e);
                }
            }
        })();
    }, []);

    return {
        stream: state
    };
};

export default useMediaStream;
