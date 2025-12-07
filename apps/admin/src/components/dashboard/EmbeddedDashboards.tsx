'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EmbeddedDashboards() {
  const [activeTab, setActiveTab] = useState('revenue');

  const dashboards = [
    {
      id: 'revenue',
      name: 'Revenue Overview',
      description: 'Revenue trends, AOV, and order metrics',
      embedUrl: '/superset/dashboard/revenue-overview',
    },
    {
      id: 'funnel',
      name: 'Conversion Funnel',
      description: 'Customer journey and drop-off analysis',
      embedUrl: '/superset/dashboard/conversion-funnel',
    },
    {
      id: 'cohorts',
      name: 'Cohort Analysis',
      description: 'Customer retention by cohort',
      embedUrl: '/superset/dashboard/cohort-retention',
    },
    {
      id: 'products',
      name: 'Product Performance',
      description: 'Sales by product and category',
      embedUrl: '/superset/dashboard/product-performance',
    },
    {
      id: 'churn',
      name: 'Churn Analysis',
      description: 'Customer churn risk and trends',
      embedUrl: '/superset/dashboard/churn-analysis',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboards</CardTitle>
        <CardDescription>
          Interactive dashboards powered by Apache Superset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            {dashboards.map((dashboard) => (
              <TabsTrigger key={dashboard.id} value={dashboard.id}>
                {dashboard.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {dashboards.map((dashboard) => (
            <TabsContent key={dashboard.id} value={dashboard.id} className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{dashboard.name}</h3>
                  <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                </div>

                {/* Embedded Superset iframe */}
                <div className="border rounded-lg overflow-hidden bg-white">
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_SUPERSET_URL}${dashboard.embedUrl}`}
                    width="100%"
                    height="800"
                    frameBorder="0"
                    className="w-full"
                    title={dashboard.name}
                  />
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Data refreshed: Just now</span>
                  <button className="text-blue-600 hover:text-blue-700">
                    Open in Superset →
                  </button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

