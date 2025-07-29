import React from 'react';
import SectionWithMockup from "@/components/ui/section-with-mockup";

const exampleData1 = {
    title: (
        <>
            Supercharge your workflow<br />with AiGenZone
        </>
    ),
    description: (
        <>
            Instantly generate, preview, and export beautiful React components.<br />
            Let AiGenZone handle the UI, so you can focus on building your product.<br />
            Experience the next level of developer productivity.
        </>
    ),
    primaryImageSrc: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    secondaryImageSrc: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
};

export function SectionMockupDemoPage() {
    return (
        <SectionWithMockup
            title={exampleData1.title}
            description={exampleData1.description}
            primaryImageSrc={exampleData1.primaryImageSrc}
            secondaryImageSrc={exampleData1.secondaryImageSrc}
        />
    );
}
