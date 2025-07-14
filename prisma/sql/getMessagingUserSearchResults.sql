-- @param {String} $1:userId id of the user that searched
-- @param {Int} $2:schoolId id of the school that the user is from
-- @param {String} $3:searchQuery query that was searched
-- @param {Int} $4:limit
-- @param {Int} $5:offset

WITH
    own_conversations AS (
        SELECT cp2."userId", cp1."conversationId"
        FROM
            "ConversationParticipant" AS cp1
            INNER JOIN "ConversationParticipant" AS cp2 ON cp1."conversationId" = cp2."conversationId"
            INNER JOIN "Conversation" AS c ON c.id = cp2."conversationId"
        WHERE
            cp1."userId" = $1
            AND cp2."userId" != $1
            AND c."isGroup" = false
            AND c."schoolId" = $2
            AND cp1."schoolId" = $2
    )
SELECT
    u.id,
    u.firstname,
    u.lastname,
    NULL AS "conversation_name",
    ow."conversationId" AS "conversation_id",
    CASE
        WHEN ow."conversationId" IS NULL THEN false
        ELSE true
    END AS has_chatted,
    'user' AS type
FROM
    "User" AS u
    LEFT JOIN own_conversations AS ow ON u.id = ow."userId"
WHERE (
        u.firstname ILIKE '%' || $3 || '%'
        OR u.lastname ILIKE '%' || $3 || '%'
    )
    AND u.id != $1
    AND u."schoolId" = $2
UNION
SELECT
    NULL AS "id",
    NULL AS "firstname",
    NULL AS "lastname",
    c.name AS "conversation_name",
    c.id AS "conversation_id",
    true AS "has_chatted",
    'conversation' AS "type"
FROM
    "Conversation" AS c
    INNER JOIN "ConversationParticipant" AS cp ON c.id = cp."conversationId"
WHERE
    cp."userId" = $1
    AND c.name IS NOT NULL
    AND c.name ILIKE '%' || $3 || '%'
    AND c."schoolId" = $2
    AND cp."schoolId" = $2
ORDER BY
    type,
    has_chatted DESC NULLS LAST,
    firstname ASC NULLS LAST,
    conversation_name ASC NULLS FIRST
LIMIT $4
OFFSET
    $5