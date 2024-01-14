import type Queue from 'bull'

export const artistWorker = async (job: Queue.Job<any>, done: Queue.DoneCallback): Promise<void> => {
  try {
    console.log('Artist job received', job.data)
    done(null, job.data)
  } catch (error: any) {
    done(error as Error)
  }
}
