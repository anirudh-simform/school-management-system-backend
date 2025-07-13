export type SearchResult = {
    id: string | null;
    firstname: string | null;
    lastname: string | null;
    conversation_id: number;
    conversation_name: string | null;
    has_chatted: boolean;
    type: "user" | "conversation";
};
