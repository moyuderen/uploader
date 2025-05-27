export const slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice

export const renderSize = (value) => {
  if (!value || isNaN(value) || value <= 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const base = 1024
  const index = Math.floor(Math.log(value) / Math.log(base))
  const size = (value / Math.pow(base, index)).toFixed(2)

  return `${size} ${units[Math.min(index, units.length - 1)]}`
}
