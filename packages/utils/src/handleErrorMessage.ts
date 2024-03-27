export const handleErrorMessage = (err: unknown, additionalContext?: string) => {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error'

  if (additionalContext) {
    return `${additionalContext}: ${errorMessage}`
  }

  return errorMessage
}
