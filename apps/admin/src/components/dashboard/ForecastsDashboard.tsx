'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function ForecastsDashboard() {
  // Mock forecast data
  const categoryForecasts = [
    {
      category: 'Electronics',
      current: 45000,
      forecast30d: 52000,
      change: 0.156,
      confidence: [48000, 56000],
      accuracy: { smape: 11.2, rmse: 1420 },
    },
    {
      category: 'Clothing',
      current: 32000,
      forecast30d: 29500,
      change: -0.078,
      confidence: [27000, 32000],
      accuracy: { smape: 13.5, rmse: 1680 },
    },
    {
      category: 'Home & Garden',
      current: 18000,
      forecast30d: 21000,
      change: 0.167,
      confidence: [19000, 23000],
      accuracy: { smape: 9.8, rmse: 980 },
    },
  ];

  const accuracyMetrics = {
    overall: {
      smape: 12.5,
      rmse: 1500,
      mape: 14.2,
    },
    target: {
      smape: 15.0,
    },
  };

  return (
    <div className="space-y-6">
      {/* Accuracy Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">sMAPE (Overall)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {accuracyMetrics.overall.smape}%
            </div>
            <p className="text-xs text-muted-foreground">
              Target: &lt;{accuracyMetrics.target.smape}% ✅
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RMSE</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracyMetrics.overall.rmse.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Root mean square error</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MAPE</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracyMetrics.overall.mape}%</div>
            <p className="text-xs text-muted-foreground">Mean absolute percentage error</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Category Forecasts</CardTitle>
          <CardDescription>
            Prophet-based demand predictions with confidence intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryForecasts.map((forecast) => (
              <div
                key={forecast.category}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{forecast.category}</h4>
                    <p className="text-sm text-muted-foreground">
                      Last 7 days: sMAPE {forecast.accuracy.smape}% | RMSE ${forecast.accuracy.rmse}
                    </p>
                  </div>
                  <Badge className={forecast.change > 0 ? 'bg-green-600' : 'bg-red-600'}>
                    {forecast.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {forecast.change > 0 ? '+' : ''}{(forecast.change * 100).toFixed(1)}%
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current (30d)</p>
                    <p className="text-xl font-bold">${forecast.current.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Forecast (Next 30d)</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${forecast.forecast30d.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">95% CI Lower</p>
                    <p className="text-xl font-bold">${forecast.confidence[0].toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">95% CI Upper</p>
                    <p className="text-xl font-bold">${forecast.confidence[1].toLocaleString()}</p>
                  </div>
                </div>

                {/* Placeholder for chart */}
                <div className="mt-4 h-32 bg-gray-50 border rounded flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    30-day trend chart - integrate Recharts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forecast vs Actuals (Last 7 Days) */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Accuracy (Last 7 Days)</CardTitle>
          <CardDescription>
            Comparison of predictions vs actual sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
            <p className="text-muted-foreground">
              Line chart: Forecast vs Actuals - integrate Recharts
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

