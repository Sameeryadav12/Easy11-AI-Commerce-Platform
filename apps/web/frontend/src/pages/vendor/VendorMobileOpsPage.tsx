import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  CloudOff,
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Loader2,
  UploadCloud,
} from 'lucide-react';
import { Card, CardBody, Badge, Button } from '../../components/ui';
import mobileBridgeAPI from '../../services/mobileBridgeAPI';
import type {
  MobileAppSnapshot,
  MobileFeature,
  DeviceSupportMatrix,
  OfflineSyncMetric,
  MobileReleaseChecklist,
} from '../../types/mobile';
import toast from 'react-hot-toast';

export default function VendorMobileOpsPage() {
  const [snapshot, setSnapshot] = useState<MobileAppSnapshot | null>(null);
  const [features, setFeatures] = useState<MobileFeature[]>([]);
  const [deviceMatrix, setDeviceMatrix] = useState<DeviceSupportMatrix[]>([]);
  const [offlineMetrics, setOfflineMetrics] = useState<OfflineSyncMetric[]>([]);
  const [checklist, setChecklist] = useState<MobileReleaseChecklist | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          snapshotData,
          featuresData,
          deviceMatrixData,
          offlineMetricsData,
          checklistData,
        ] = await Promise.all([
          mobileBridgeAPI.getMobileAppSnapshot(),
          mobileBridgeAPI.getMobileFeatureParity(),
          mobileBridgeAPI.getDeviceSupportMatrix(),
          mobileBridgeAPI.getOfflineSyncMetrics(),
          mobileBridgeAPI.getMobileReleaseChecklist(),
        ]);
        if (!isMounted) return;
        setSnapshot(snapshotData);
        setFeatures(featuresData);
        setDeviceMatrix(deviceMatrixData);
        setOfflineMetrics(offlineMetricsData);
        setChecklist(checklistData);
      } catch (err) {
        console.error('[Mobile Ops] Failed to load mobile bridge data', err);
        if (!isMounted) return;
        setError('Unable to load mobile readiness data. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const healthStats = useMemo(() => {
    const warningQueues = offlineMetrics.filter((queue) => queue.status !== 'healthy').length;
    const completeFeatures = features.filter((feature) => feature.status === 'complete').length;
    const totalFeatures = features.length || 1;
    const parityScore = Math.round((completeFeatures / totalFeatures) * 100);
    return {
      warningQueues,
      parityScore,
      storesReady: deviceMatrix.filter((device) => device.store_status === 'approved').length,
    };
  }, [offlineMetrics, features, deviceMatrix]);

  const getStatusBadge = (status: OfflineSyncMetric['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge color="emerald">Healthy</Badge>;
      case 'warning':
        return <Badge color="amber">Monitor</Badge>;
      default:
        return <Badge color="rose">Action needed</Badge>;
    }
  };

  const getChecklistIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
    }
  };

  const handleExportChecklist = () => {
    if (!checklist) {
      toast.error('Checklist data not loaded yet.');
      return;
    }
    const data = JSON.stringify(checklist, null, 2);
    navigator.clipboard
      .writeText(data)
      .then(() => {
        toast.success('Release checklist copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy checklist. Try again.');
      });
  };

  return (
    <div className="pb-16 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
          <Badge color="blue" className="w-fit">
            Sprint 13 · Mobile Ops Command Center
          </Badge>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-gray-900 dark:text-white">
            Mobile ecosystem readiness
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-3xl">
            Bridge the Easy11 web platform into a unified mobile app. Track feature parity, release
            readiness, and offline health in one place.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExportChecklist}>
          <UploadCloud className="w-4 h-4" />
          Export release checklist
        </Button>
      </div>

      {error && (
        <Card className="border border-amber-300 bg-amber-50 dark:bg-amber-900/20">
          <CardBody className="flex items-center gap-3 text-sm text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </CardBody>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {snapshot && (
            <Card>
              <CardBody className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Current release
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {snapshot.version} · {snapshot.release_phase.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Build {snapshot.build_number} · Crash-free sessions {snapshot.crash_free_sessions}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Deployment
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Last deploy {new Date(snapshot.last_deploy_at).toLocaleString()}
                  </p>
                  {snapshot.next_release_at && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Next release {new Date(snapshot.next_release_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Active testers
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {snapshot.active_testers.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">TestFlight + Play Console</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Release notes
                  </p>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    {snapshot.release_notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </CardBody>
            </Card>
          )}

          <section className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Feature parity</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {healthStats.parityScore}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Coverage across critical vendor flows, mapped to their web counterparts.
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <CloudOff className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Offline queues</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {healthStats.warningQueues > 0 ? `${healthStats.warningQueues} watch` : 'All healthy'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monitor background sync and ensure no customer-impacting drift.
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Store readiness</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {healthStats.storesReady}/2 stores approved
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Track App Store and Play Store approval status with timestamps.
                </p>
              </CardBody>
            </Card>
          </section>

          <section className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Feature parity tracker
                  </h2>
                </div>
                <div className="space-y-4">
                  {features.map((feature) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-slate-800/40"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            {feature.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                        <Badge
                          color={
                            feature.status === 'complete'
                              ? 'emerald'
                              : feature.status === 'in_progress'
                              ? 'amber'
                              : 'slate'
                          }
                        >
                          {feature.status}
                        </Badge>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-2">
                        {feature.linked_web_feature && (
                          <p>
                            Web source: <span className="font-medium">{feature.linked_web_feature}</span>
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <span>Owner: {feature.owner}</span>
                          <Badge
                            color={
                              feature.parity_gap === 'none'
                                ? 'emerald'
                                : feature.parity_gap === 'partial'
                                ? 'amber'
                                : 'slate'
                            }
                          >
                            Parity: {feature.parity_gap ?? 'full'}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Device support matrix
                  </h2>
                </div>
                <div className="space-y-4">
                  {deviceMatrix.map((device) => (
                    <div
                      key={`${device.os}-${device.minimum_version}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-white/70 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {device.os}
                        </p>
                        <Badge
                          color={
                            device.store_status === 'approved'
                              ? 'emerald'
                              : device.store_status === 'in_review'
                              ? 'amber'
                              : 'slate'
                          }
                        >
                          {device.store_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Min {device.minimum_version} · Recommended {device.recommended_version}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <p>QA devices:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {device.tested_devices.map((tested) => (
                            <li key={tested}>{tested}</li>
                          ))}
                        </ul>
                        {device.last_store_review_at && (
                          <p>
                            Last store review:{' '}
                            {new Date(device.last_store_review_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>

          <section className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <CloudOff className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Offline sync health
                  </h2>
                </div>
                <div className="space-y-4">
                  {offlineMetrics.map((queue) => (
                    <div
                      key={queue.queue_name}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-3 bg-white/70 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {queue.queue_name}
                        </p>
                        {getStatusBadge(queue.status)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <p>Pending items: {queue.pending_items}</p>
                        <p>Average retry: {queue.avg_retry_count.toFixed(1)}x</p>
                        <p>Last sync: {new Date(queue.last_sync_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Release checklist
                  </h2>
                </div>
                <div className="space-y-4">
                  {checklist?.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start gap-3 bg-white/70 dark:bg-slate-800/40"
                    >
                      {getChecklistIcon(item.status)}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Owner: {item.owner} · Due {new Date(item.due_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}


