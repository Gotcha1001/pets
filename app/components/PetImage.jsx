
'use client';

export default function PetImage({ src, alt }) {
    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-48 object-cover mb-2 rounded-md"
            onError={() => console.error(`Failed to load image: ${src}`)}
        />
    );
}
