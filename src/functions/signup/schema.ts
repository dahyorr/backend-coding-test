export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    dateOfBirth: { type: 'string'},
  },
  required: ['name', 'email', 'password', 'dateOfBirth']
} as const;
