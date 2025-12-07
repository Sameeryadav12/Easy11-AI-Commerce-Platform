'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Clock,
  ArrowUpCircle,
  ArrowDownCircle 
} from 'lucide-react';

export default function MLOpsControl() {
  const [deployedVersion, setDeployedVersion] = useState('v2.1.0');

  // Mock model data
  const models = [
    {
      name: 'ALS Recommendations',
      version: 'v2.1.0',
      status: 'production',
      metrics: {
        hitRate10: 0.24,
        precision5: 0.45,
        recall10: 0.38,
        latencyP95: 135,
        cacheHitRate: 0.72,
      },
      lastTrained: '2024-11-30 03:00:00',
    },
    {
      name: 'XGBoost Churn',
      version: 'v1.5.0',
      status: 'production',
      metrics: {
        auc: 0.83,
        precision: 0.75,
        recall: 0.72,
        f1Score: 0.735,
      },
      lastTrained: '2024-11-30 03:15:00',
    },
    {
      name: 'Prophet Forecast',
      version: 'v2.0.0',
      status: 'production',
      metrics: {
        smape: 12.5,
        rmse: 150.3,
        mape: 14.2,
      },
      lastTrained: '2024-11-30 03:30:00',
    },
  ];

  const candidateModels = [
    {
      name: 'ALS Recommendations',
      version: 'v2.2.0',
      status: 'candidate',
      metrics: {
        hitRate10: 0.26,
        precision5: 0.48,
        recall10: 0.42,
        latencyP95: 128,
      },
      improvement: '+8.3%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Production Models */}
      <div className="grid gap-4 md:grid-cols-3">
        {models.map((model) => (
          <Card key={model.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Production
                </Badge>
              </div>
              <CardDescription>Version {model.version}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Key Metrics */}
                {model.name === 'ALS Recommendations' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">HitRate@10</span>
                      <span className="font-semibold">{model.metrics.hitRate10}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Precision@5</span>
                      <span className="font-semibold">{model.metrics.precision5}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Latency (p95)</span>
                      <span className="font-semibold">{model.metrics.latencyP95}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cache Hit</span>
                      <span className="font-semibold">{(model.metrics.cacheHitRate * 100).toFixed(0)}%</span>
                    </div>
                  </>
                )}

                {model.name === 'XGBoost Churn' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">AUC</span>
                      <span className="font-semibold">{model.metrics.auc}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Precision</span>
                      <span className="font-semibold">{model.metrics.precision}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">F1 Score</span>
                      <span className="font-semibold">{model.metrics.f1Score}</span>
                    </div>
                  </>
                )}

                {model.name === 'Prophet Forecast' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">sMAPE</span>
                      <span className="font-semibold">{model.metrics.smape}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">RMSE</span>
                      <span className="font-semibold">{model.metrics.rmse}</span>
                    </div>
                  </>
                )}

                <div className="text-xs text-muted-foreground mt-2">
                  Last trained: {model.lastTrained}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Candidate Models */}
      {candidateModels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Candidate Models</CardTitle>
            <CardDescription>
              New model versions ready for promotion
            </CardDescription>
          </CardHeader>
          <CardContent>
            {candidateModels.map((model) => (
              <div
                key={`${model.name}-${model.version}`}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{model.name}</h4>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {model.version}
                    </Badge>
                    <span className="text-sm text-green-600 font-medium flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {model.improvement}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div>
                      <div className="text-xs text-muted-foreground">HitRate@10</div>
                      <div className="font-semibold">{model.metrics.hitRate10}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Precision@5</div>
                      <div className="font-semibold">{model.metrics.precision5}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Latency</div>
                      <div className="font-semibold">{model.metrics.latencyP95}ms</div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="default" size="sm">
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    Promote
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Model History */}
      <Card>
        <CardHeader>
          <CardTitle>Model Version History</CardTitle>
          <CardDescription>Previous model versions and rollback options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { version: 'v2.1.0', date: '2024-11-30', status: 'current', hitRate: 0.24 },
              { version: 'v2.0.0', date: '2024-11-15', status: 'archived', hitRate: 0.22 },
              { version: 'v1.9.0', date: '2024-11-01', status: 'archived', hitRate: 0.21 },
            ].map((item) => (
              <div
                key={item.version}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-medium">{item.version}</div>
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                  {item.status === 'current' && (
                    <Badge className="bg-green-600">Current</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    HitRate@10: <span className="font-semibold">{item.hitRate}</span>
                  </div>
                  {item.status !== 'current' && (
                    <Button variant="outline" size="sm">
                      <ArrowDownCircle className="w-4 h-4 mr-2" />
                      Rollback
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

