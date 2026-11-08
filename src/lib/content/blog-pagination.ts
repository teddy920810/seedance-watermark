export interface BlogPage<T> {
  number: number;
  totalPages: number;
  totalPosts: number;
  posts: T[];
  path: string;
  previous?: string;
  next?: string;
  start: number;
  end: number;
}

export function paginateBlogPosts<T>(posts: readonly T[], pageSize = 10): BlogPage<T>[] {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) throw new Error('Page size must be a positive integer.');
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const path = (number: number) => number === 1 ? '/blog' : `/blog/page/${number}`;
  return Array.from({ length: totalPages }, (_, index) => ({
    number: index + 1,
    totalPages,
    totalPosts: posts.length,
    posts: posts.slice(index * pageSize, (index + 1) * pageSize),
    path: path(index + 1),
    previous: index > 0 ? path(index) : undefined,
    next: index + 1 < totalPages ? path(index + 2) : undefined,
    start: posts.length ? index * pageSize + 1 : 0,
    end: Math.min((index + 1) * pageSize, posts.length),
  }));
}
