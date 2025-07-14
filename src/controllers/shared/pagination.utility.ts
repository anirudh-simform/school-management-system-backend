function getPaginationParams(
    pageNumber: number | undefined,
    pageSize: number | undefined
) {
    let pageNumberConverted = Number(pageNumber);
    let pageSizeConverted = Number(pageSize);

    // Handle non-number as well as nullish values
    pageNumberConverted =
        Number.isNaN(pageNumberConverted) || pageNumberConverted <= 0
            ? 1
            : pageNumberConverted;
    pageSizeConverted =
        Number.isNaN(pageSizeConverted) || pageSizeConverted < 10
            ? 10
            : pageSizeConverted;

    if (pageSizeConverted > 100) {
        pageSizeConverted = 100;
    }

    return {
        skip: (pageNumberConverted - 1) * pageSizeConverted,
        take: pageSizeConverted,
    };
}

export { getPaginationParams };
