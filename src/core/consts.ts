export const QUERY_EDITOR_UUID = 'query.graphql';
export const VARIABLE_EDITOR_UUID = 'vars.json';
export const FALLBACK_ENDPOINT = 'https://rickandmortyapi.com/graphql/';
export const DEFAULT_QUERY = `
query {
    characters {
        results {
            name
        }
    }
}
`