let uid = 0
export const generateUid = (prex = 'id') => `${prex}-${+new Date()}-${uid++}`
