'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, PauseCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function ExperimentsManager() {
  // Mock experiments data
  const experiments = [
    {
      id: 'exp-001',
      name: 'Recommendations Placement A vs B',
      description: 'Test homepage vs sidebar recommendation placement',
      status: 'running',
      startDate: '2024-11-25',
      variants: [
        { name: 'Control', allocation: 50, conversions: 245, visitors: 5200, conversionRate: 0.047 },
        { name: 'Treatment', allocation: 50, conversions: 289, visitors: 5150, conversionRate: 0.056 },
      ],
      uplift: 0.191, // 19.1% improvement
      pValue: 0.023,
      confidence: 0.977,
    },
    {
      id: 'exp-002',
      name: 'New Search Ranker',
      description: 'TF-IDF vs BM25 ranking algorithm',
      status: 'completed',
      startDate: '2024-11-10',
      endDate: '2024-11-24',
      variants: [
        { name: 'TF-IDF', allocation: 50, conversions: 412, visitors: 8500, conversionRate: 0.048 },
        { name: 'BM25', allocation: 50, conversions: 398, visitors: 8600, conversionRate: 0.046 },
      ],
      uplift: -0.042,
      pValue: 0.612,
      confidence: 0.388,
      winner: 'TF-IDF',
    },
    {
      id: 'exp-003',
      name: 'Checkout Flow Simplification',
      description: 'Single-page vs multi-step checkout',
      status: 'draft',
      variants: [
        { name: 'Multi-step', allocation: 50 },
        { name: 'Single-page', allocation: 50 },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-600"><PlayCircle className="w-3 h-3 mr-1" />Running</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'draft':
        return <Badge variant="outline"><PauseCircle className="w-3 h-3 mr-1" />Draft</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {experiments
            .filter((exp) => exp.status === 'running')
            .map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{experiment.name}</CardTitle>
                      <CardDescription>{experiment.description}</CardDescription>
                    </div>
                    {getStatusBadge(experiment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Variant Results */}
                    <div className="grid grid-cols-2 gap-4">
                      {experiment.variants.map((variant) => (
                        <div key={variant.name} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-3">{variant.name}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Visitors</span>
                              <span className="font-medium">{variant.visitors?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Conversions</span>
                              <span className="font-medium">{variant.conversions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Conv. Rate</span>
                              <span className="font-semibold text-lg">
                                {((variant.conversionRate || 0) * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Statistical Results */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Uplift</div>
                          <div className={`text-2xl font-bold ${experiment.uplift > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {experiment.uplift > 0 && '+'}{(experiment.uplift * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">p-value</div>
                          <div className="text-2xl font-bold">{experiment.pValue.toFixed(3)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Confidence</div>
                          <div className="text-2xl font-bold">{(experiment.confidence * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      {experiment.confidence >= 0.95 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-sm text-green-800">
                            Statistically significant! Ready to declare winner.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Export Report</Button>
                      <Button variant="destructive" size="sm">Stop Experiment</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {experiments
            .filter((exp) => exp.status === 'completed')
            .map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{experiment.name}</CardTitle>
                      <CardDescription>{experiment.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(experiment.status)}
                      {experiment.winner && (
                        <Badge className="bg-blue-600">Winner: {experiment.winner}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Ran from {experiment.startDate} to {experiment.endDate}
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">View Full Report</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4 mt-6">
          {experiments
            .filter((exp) => exp.status === 'draft')
            .map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{experiment.name}</CardTitle>
                      <CardDescription>{experiment.description}</CardDescription>
                    </div>
                    {getStatusBadge(experiment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button size="sm">Configure</Button>
                    <Button variant="outline" size="sm">Start Experiment</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

