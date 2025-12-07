'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingDown, AlertTriangle, Crown } from 'lucide-react';

export default function CustomersChurnDashboard() {
  // Mock RFM segment data
  const rfmSegments = [
    { 
      name: 'Champions', 
      count: 1245, 
      avgValue: 5420, 
      churnRisk: 0.05,
      color: 'bg-green-600',
      r: 5, f: 5, m: 5
    },
    { 
      name: 'Loyal Customers', 
      count: 2156, 
      avgValue: 3200, 
      churnRisk: 0.12,
      color: 'bg-blue-600',
      r: 4, f: 5, m: 4
    },
    { 
      name: 'At Risk', 
      count: 847, 
      avgValue: 2800, 
      churnRisk: 0.78,
      color: 'bg-red-600',
      r: 2, f: 4, m: 4
    },
    { 
      name: 'Cannot Lose Them', 
      count: 234, 
      avgValue: 8900, 
      churnRisk: 0.65,
      color: 'bg-orange-600',
      r: 2, f: 2, m: 5
    },
    { 
      name: 'New Customers', 
      count: 1456, 
      avgValue: 890, 
      churnRisk: 0.35,
      color: 'bg-purple-600',
      r: 5, f: 1, m: 2
    },
    { 
      name: 'Lost', 
      count: 643, 
      avgValue: 450, 
      churnRisk: 0.95,
      color: 'bg-gray-600',
      r: 1, f: 1, m: 1
    },
  ];

  const highRiskCustomers = [
    {
      id: 'cust-001',
      name: 'John D.',
      email: 'j***@***.com',
      segment: 'At Risk',
      churnProb: 0.85,
      lastOrder: '2024-09-15',
      reasons: ['Long time since purchase', 'Support tickets', 'Failed payment'],
    },
    {
      id: 'cust-002',
      name: 'Sarah M.',
      email: 's***@***.com',
      segment: 'Cannot Lose Them',
      churnProb: 0.72,
      lastOrder: '2024-08-22',
      reasons: ['Inactive 90+ days', 'High CLV', 'No recent engagement'],
    },
    {
      id: 'cust-003',
      name: 'Mike R.',
      email: 'm***@***.com',
      segment: 'At Risk',
      churnProb: 0.68,
      lastOrder: '2024-10-05',
      reasons: ['Decreasing order frequency', 'Lower basket size'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rfmSegments.reduce((sum, s) => sum + s.count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all segments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Champions</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rfmSegments.find(s => s.name === 'Champions')?.count.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">Top tier customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rfmSegments.filter(s => s.churnRisk > 0.6).reduce((sum, s) => sum + s.count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CLV</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(rfmSegments.reduce((sum, s) => sum + s.avgValue * s.count, 0) / rfmSegments.reduce((sum, s) => sum + s.count, 0)).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">Customer lifetime value</p>
          </CardContent>
        </Card>
      </div>

      {/* RFM Segments */}
      <Card>
        <CardHeader>
          <CardTitle>RFM Segments</CardTitle>
          <CardDescription>
            Customer segmentation based on Recency, Frequency, and Monetary value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rfmSegments.map((segment) => (
              <div
                key={segment.name}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                  <div>
                    <h4 className="font-semibold">{segment.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      RFM: {segment.r}-{segment.f}-{segment.m}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Customers</div>
                    <div className="font-semibold">{segment.count.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Avg Value</div>
                    <div className="font-semibold">${segment.avgValue.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Churn Risk</div>
                    <div className={`font-semibold ${segment.churnRisk > 0.6 ? 'text-red-600' : 'text-green-600'}`}>
                      {(segment.churnRisk * 100).toFixed(0)}%
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Customers
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High-Risk Customers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>High-Risk Customers</CardTitle>
              <CardDescription>
                Customers with churn probability > 65%
              </CardDescription>
            </div>
            <Button variant="outline">
              Export All (CSV)
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {highRiskCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-start justify-between p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="font-semibold">{customer.name}</h4>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                    <Badge className="bg-red-600">{(customer.churnProb * 100).toFixed(0)}% Risk</Badge>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Segment</p>
                      <p className="font-medium">{customer.segment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Order</p>
                      <p className="font-medium">{customer.lastOrder}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-1">Top Churn Factors:</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.reasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="default" size="sm">
                    Send Offer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Churn Heatmap Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Churn Risk Heatmap</CardTitle>
          <CardDescription>
            Visual representation of churn risk across RFM segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center border rounded-lg bg-gray-50">
            <p className="text-muted-foreground">
              Heatmap visualization - connect to Recharts/D3 for full implementation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

