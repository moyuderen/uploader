export async function pool(tasks, limit = 3) {
  const runingTasks = new Set()
  const results = []

  for (const chunk of tasks) {
    const p = chunk.send()
    p.file = chunk.file

    results.push(p)
    runingTasks.add(p)

    p.then(() => {
      runingTasks.delete(p)
      p.file.uploadedChunks.push(chunk)
    }).catch(() => {
      runingTasks.delete(p)
      p.file.errorChunks.push(chunk)
    })

    if (runingTasks.size >= limit) {
      await Promise.race(runingTasks)
    }
  }

  return Promise.all(results)
}
