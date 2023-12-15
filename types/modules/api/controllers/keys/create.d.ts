import { C_Keys } from "@dogma-project/constants-meta";
export default function createKey({ name, length, type, }: {
    name: string;
    length: 1024 | 2048 | 4096;
    type: C_Keys.Type;
}): Promise<{
    result: boolean;
} | undefined>;
