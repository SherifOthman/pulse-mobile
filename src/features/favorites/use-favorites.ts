// Re-export from canonical location to consolidate duplicate implementations.
// The hooks/ subfolder version has staleTime and is the authoritative source.
export { useFavorites as useGetFavorites, useToggleFavorite } from "./hooks/use-favorites";
