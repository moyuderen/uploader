function wrapperPromise(p) {
  if (p.then && typeof p.then === 'function') {
    return p
  }
  return Promise.resolve(p)
}

export async function pool(tasks, limit = 3) {
  const runingTasks = new Set()
  const results = []

  for (const chunk of tasks) {
    const p = chunk.send()
    p.file = chunk.file

    results.push(p)
    runingTasks.add(p)
    p.file.upladingChunks.push(chunk)

    p.then(() => {
      runingTasks.delete(p)
      // p.file.upladingChunks.push(chunk)
      p.file.uploadedChunks.push(chunk)
    }).catch(() => {
      runingTasks.delete(p)
      // p.file.upladingChunks.push(chunk)
      p.file.errorChunks.push(chunk)
    })

    if (runingTasks.size >= limit) {
      await Promise.race(runingTasks)
    }
  }

  return Promise.all(results)
}
