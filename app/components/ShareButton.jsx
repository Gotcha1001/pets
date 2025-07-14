'use client';

import { Button } from "@/components/ui/button";

export default function ShareButton({ petId }) {
    const handleShare = async () => {
        const url = `${window.location.origin}/pets/${petId}`;

        try {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <Button onClick={handleShare}>
            Share
        </Button>
    );
}