/// <reference types="node" />
export default function Path(path: string): {
    path: string[];
    query: import("url").URLSearchParams;
};
