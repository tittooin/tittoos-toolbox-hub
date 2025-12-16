
import { Timestamp } from 'firebase/firestore';

export interface Comment {
    id: string;
    toolId: string;
    text: string;
    userId: string;
    userName: string;
    userPhoto: string;
    createdAt: Timestamp;
    likes: number;
    parentId: string | null;
}
