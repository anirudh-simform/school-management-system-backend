export type CreateConversationDto = {
    participantIds: string[];
    name?: string;
    isGroup?: boolean;
};

export type GetConversationsQueryParams = {
    query: string;
    pageNumber: number;
    pageSize: number;
};
