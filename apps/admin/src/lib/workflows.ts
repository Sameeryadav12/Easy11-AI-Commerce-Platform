import { opsBus } from '@/lib/ops-bus'
import { recordAuditEvent } from '@/lib/audit'
import { decisionStore } from '@/lib/decisions'

export type WorkflowStatus = 'pending' | 'simulated' | 'approved' | 'executed' | 'undone'
export type WorkflowKind =
	| 'scale_pods'
	| 'purge_cache'
	| 'retry_payouts'
	| 'switch_asr_provider'
	| 'freeze_model'

export interface WorkflowItem {
	id: string
	createdAt: string
	updatedAt: string
	status: WorkflowStatus
	kind: WorkflowKind
	reason: string
	severity: 'warn' | 'critical'
	target: { service: string; region?: string }
	parameters?: Record<string, unknown>
}

class WorkflowEngine {
	private items: Map<string, WorkflowItem> = new Map()

	list() {
		return [...this.items.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
	}

	get(id: string) {
		return this.items.get(id)
	}

	create(item: Omit<WorkflowItem, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: WorkflowStatus }) {
		const id = 'wf_' + Math.random().toString(36).slice(2, 10)
		const now = new Date().toISOString()
		const wf: WorkflowItem = {
			id,
			createdAt: now,
			updatedAt: now,
			status: item.status ?? 'pending',
			...item,
		}
		this.items.set(id, wf)
		opsBus.push({ type: 'workflow.created', item: wf })
		decisionStore.create({
			actorId: 'system',
			action: 'suggest',
			resource: 'workflow',
			referenceId: id,
			input: { reason: wf.reason, parameters: wf.parameters, target: wf.target, kind: wf.kind },
			explain: { source: 'anomaly_detector' },
		})
		try {
			recordAuditEvent({
				actor: 'system',
				role: 'system_admin',
				resource: 'workflow',
				action: 'create',
				context: { id, kind: wf.kind, reason: wf.reason },
			})
		} catch {}
		return wf
	}

	private update(id: string, status: WorkflowStatus) {
		const wf = this.items.get(id)
		if (!wf) return null
		wf.status = status
		wf.updatedAt = new Date().toISOString()
		this.items.set(id, wf)
		opsBus.push({ type: `workflow.${status}`, item: wf })
		decisionStore.create({
			actorId: 'system',
			action: status === 'simulated' ? 'simulate' : status === 'approved' ? 'approve' : status === 'executed' ? 'execute' : 'undo',
			resource: 'workflow',
			referenceId: id,
			input: { kind: wf.kind, target: wf.target, parameters: wf.parameters },
			output: { status: wf.status },
		})
		try {
			recordAuditEvent({
				actor: 'system',
				role: 'system_admin',
				resource: 'workflow',
				action: status,
				context: { id, kind: wf.kind },
			})
		} catch {}
		return wf
	}

	simulate(id: string) {
		return this.update(id, 'simulated')
	}
	approve(id: string) {
		return this.update(id, 'approved')
	}
	execute(id: string) {
		return this.update(id, 'executed')
	}
	undo(id: string) {
		return this.update(id, 'undone')
	}
}

export const workflowEngine = new WorkflowEngine()

// Helper mapping from anomaly signals to suggested workflows
export function suggestWorkflowFromAnomaly(anomaly: any): Omit<WorkflowItem, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
	const service = anomaly?.service ?? 'unknown'
	const metric = anomaly?.metric ?? 'metric'
	let kind: WorkflowKind = 'purge_cache'
	let params: Record<string, unknown> | undefined
	if (metric === 'latency_ms') {
		kind = 'scale_pods'
		params = { replicas: 2 }
	} else if (metric === 'error_rate_pct') {
		kind = 'purge_cache'
	} else if (anomaly?.domain === 'ai') {
		kind = 'freeze_model'
	}
	return {
		kind,
		reason: anomaly?.reason ?? 'auto-detected anomaly',
		severity: anomaly?.level ?? 'warn',
		target: { service },
		parameters: params,
	}
}


