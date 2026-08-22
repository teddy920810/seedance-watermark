export function visibleItems<T>(
  items: readonly T[],
  isComplete: (item: T) => boolean = () => true,
): T[] {
  return items.filter((item) => (item as T & { enabled?: boolean }).enabled !== false && isComplete(item));
}

export function isCompleteFeature(item: { heading?: string; description?: string }): boolean {
  return Boolean(item.heading?.trim() && item.description?.trim());
}

export function isCompleteFaq(item: { question?: string; answer?: string }): boolean {
  return Boolean(item.question?.trim() && item.answer?.trim());
}

export function isCompleteStep(item: { title?: string; description?: string }): boolean {
  return Boolean(item.title?.trim() && item.description?.trim());
}
