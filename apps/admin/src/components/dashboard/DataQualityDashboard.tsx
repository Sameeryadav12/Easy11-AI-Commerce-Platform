'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

export default function DataQualityDashboard() {
  // Mock data - will connect to Great Expectations API
  const suites = [
    {
      name: 'Orders Validation Suite',
      totalExpectations: 15,
      passed: 14,
      failed: 1,
      lastRun: '2024-12-01 02:00:00',
      status: 'warning',
    },
    {
      name: 'Products Validation Suite',
      totalExpectations: 12,
      passed: 12,
      failed: 0,
      lastRun: '2024-12-01 02:00:00',
      status: 'success',
    },
    {
      name: 'Users Validation Suite',
      totalExpectations: 8,
      passed: 8,
      failed: 0,
      lastRun: '2024-12-01 02:00:00',
      status: 'success',
    },
  ];

  const failedExpectations = [
    {
      suite: 'Orders',
      expectation: 'expect_column_values_to_be_between',
      column: 'order_total',
      details: 'Found 3 values outside range [0, 50000]',
      severity: 'warning',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suites</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suites.length}</div>
            <p className="text-xs text-muted-foreground">Active validation suites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {suites.reduce((sum, s) => sum + s.passed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Expectations passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {suites.reduce((sum, s) => sum + s.failed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Expectations failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Suites */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Suites</CardTitle>
          <CardDescription>Great Expectations suite status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suites.map((suite) => (
              <div
                key={suite.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(suite.status)}
                  <div>
                    <h4 className="font-medium">{suite.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Last run: {suite.lastRun}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{suite.passed}</div>
                    <div className="text-xs text-muted-foreground">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{suite.failed}</div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      {suite.totalExpectations} total
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Failed Expectations */}
      {failedExpectations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Failed Expectations</CardTitle>
            <CardDescription>Expectations that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failedExpectations.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.suite}: {item.column}</h4>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.expectation}</p>
                    <p className="text-sm text-gray-700 mt-1">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Lineage */}
      <Card>
        <CardHeader>
          <CardTitle>Data Lineage</CardTitle>
          <CardDescription>View dbt data transformation lineage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">dbt Documentation</h4>
              <p className="text-sm text-muted-foreground">
                View complete data lineage and model documentation
              </p>
            </div>
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Open dbt Docs
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

