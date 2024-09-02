"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react";
import "react-quill/dist/react-quill"
import "react-quill/dist/quill.bubble.css"

interface EditorProps {
    onChange: (value: string) => void;
    value: string
};

export const Editor = ({
    onChange,
    value
}:EditorProps) => {
    const ReactQuill = useMemo(() => dynamic(()=> import("react-quill"), { ssr: false }), [])

    return (
        <ReactQuill
            value={value}
            onChange={onChange}
        />
    )
}

interface PreviewProps {
    value: string
}

export const Preview = ({
    value
}:PreviewProps) => {
    const ReactQuill = useMemo(() => dynamic(()=> import("react-quill"), { ssr: false }), [])

    return (
        <ReactQuill
            theme="bubble"
            value={value}
            readOnly
        />
    )
}
