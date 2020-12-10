import { JobIssued, ContributionAdded, ContributionRefunded, JobInvoice,
         InvoiceAccepted, JobChanged, JobDataChanged, CandidateAccepted, InvoiceCancelled } from '../generated/EthlanceJobs/EthlanceJobs'
import { Job, Contributor } from '../generated/schema'

export function handleJobIssued(event: JobIssued): void {
  let job = new Job(event.params._jobId.toHex())
  job.state = "Created"
  job.creator = event.params._creator
  job.token = event.params._token
  job.content = event.params._ipfsHash
  job.num_job_changes = 0
  job.num_data_changes = 0
  job.num_contributions = 0
  job.num_refunds = 0

  job.save()
}

export function handleContributionAdded(event: ContributionAdded): void {
  let id = event.params._jobId.toHex()
  let job = Job.load(id)

  job.state = "InProgress"

  job.save()
}

export function handleContributionRefunded(event: ContributionRefunded): void {
  let id = event.params._jobId.toHex()
  let job = Job.load(id)

  job.num_refunds += 1

  job.save()
}

export function handleJobInvoice(event: JobInvoice): void {
  let id = event.params._jobId.toHex()
  let job = Job.load(id)

   job.state = "Submitted"
   job.save()
}

export function handleInvoiceAccepted(event: InvoiceAccepted): void {
  let id = event.params._jobId.toHex()
  let job = Job.load(id)

  job.state = "Paid"
  job.save()
}

export function handleJobChanged(event: JobChanged): void {
  let id = event.params._jobId.toHex()
  let job = Job.load(id)

  job.num_job_changes += 1
  job.save()
}

export function handleJobDataChanged(event: JobDataChanged): void {
  let id = event.params._jobId.toHex()
  let job = Job.load(id)

  job.num_data_changes += 1
  job.save()
}

export function handleCandidateAccepted(event: CandidateAccepted): void {
  let id = event.params._jobId.toHex()
  let job = Job.load(id)

  let candidate = event.params._candidate.toHex()
  let contributor = Contributor.load(candidate)
  if (contributor == null) {
    contributor = new Contributor(candidate)
  }

  contributor.job = id
  contributor.save()

  job.state = "Assigned"
  job.contributor = candidate

  job.save()
}

export function handleInvoiceCancelled(event: InvoiceCancelled): void {
  let id = event.params._jobId.toHex()
  let job = Job.load(id)

  job.state = "InProgress"
  job.save()
}
