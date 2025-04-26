const SortBy = Object.freeze({
  LATEST: {
    value: 'latest',
    label: 'Latest',
    field: ['createdAt'],
    order: 'desc',
  },
  POPULAR: {
    value: 'popular',
    label: 'Popular',
    field: ['views', 'likesCount'],
    order: 'desc',
  },
  OLDEST: {
    value: 'oldest',
    label: 'Oldest',
    field: ['createdAt'],
    order: 'asc',
  },
});

export default SortBy;
