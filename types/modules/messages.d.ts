export function commit({ id, text, files, direction, format, type }: {
    id: string;
    text: string;
    files: any[];
    direction: number;
    format: number;
    type: number;
}): Promise<string>;
