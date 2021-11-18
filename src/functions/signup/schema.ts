export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    dateOfBirth: { 
      type: 'string'
    },
    role: { type: 'string' },
  },
  required: ['name', 'email', 'password', 'dateOfBirth', 'role']
} as const;
