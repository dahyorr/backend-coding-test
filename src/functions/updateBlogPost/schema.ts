export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    published: { type: 'boolean' },
  },
  required: ['title', 'content']
} as const;
