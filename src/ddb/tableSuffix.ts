import "reflect-metadata"

const stage = process.env.STAGE ?? 'development'
export const ddbTableSuffix = stage[0].toUpperCase() + stage.slice(1)