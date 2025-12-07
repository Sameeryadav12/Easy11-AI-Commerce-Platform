import { CheckCircle2, AlertTriangle, Sparkles, Palette } from 'lucide-react';
import { Card, CardBody, Badge } from '../../components/ui';
import type { AIValidationResult, SEOSuggestion, AIImageAnalysis } from '../../types/vendorProduct';

interface AIValidationSummaryProps {
  validation?: AIValidationResult;
  seoSuggestions?: SEOSuggestion[];
  imageInsights?: AIImageAnalysis[];
}

const impactColors: Record<SEOSuggestion['impact'], string> = {
  high: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
};

export function AIValidationSummary({ validation, seoSuggestions, imageInsights }: AIValidationSummaryProps) {
  if (!validation) {
    return (
      <Card className="border border-dashed border-gray-300 dark:border-gray-700">
        <CardBody className="text-sm text-gray-500 dark:text-gray-400">
          AI validation will appear here once you run the checks after saving your product.
        </CardBody>
      </Card>
    );
  }

  const totalChecks = validation.checks.length;
  const passedChecks = validation.checks.filter((check) => check.passed).length;

  return (
    <div className="space-y-6">
      <Card className="border border-emerald-200 dark:border-emerald-900/40">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
                AI Quality Review
              </p>
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                {validation.overall_score}/100 overall health
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {passedChecks}/{totalChecks} checks passed · model {validation.model_version}
              </p>
            </div>
            <Badge variant="success" size="sm">
              Last validated {new Date(validation.last_validated_at).toLocaleString()}
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {validation.checks.map((check) => (
              <div
                key={check.check_type}
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                {check.passed ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900 capitalize dark:text-white">
                    {check.check_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{check.message}</p>
                </div>
              </div>
            ))}
          </div>

          {validation.suggestions.length > 0 && (
            <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
              <p className="font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
                Quick wins
              </p>
              <ul className="mt-2 space-y-2">
                {validation.suggestions.map((suggestion) => (
                  <li key={suggestion} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>

      {seoSuggestions && seoSuggestions.length > 0 && (
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                SEO recommendations
              </h3>
            </div>
            <div className="space-y-3">
              {seoSuggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${index}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 capitalize dark:text-white">
                      {suggestion.type}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${impactColors[suggestion.impact]}`}>
                      {suggestion.impact} impact
                    </span>
                  </div>
                  {suggestion.current && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Current: {suggestion.current}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">
                    Suggested: <span className="font-medium">{suggestion.suggested}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reason: {suggestion.reason}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {imageInsights && imageInsights.length > 0 && (
        <Card>
          <CardBody className="space-y-3">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                Image quality insights
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {imageInsights.map((insight) => (
                <div
                  key={insight.image_id}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Image {insight.image_id}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quality score: {insight.quality_score}/100
                  </p>
                  {insight.suggested_tags && insight.suggested_tags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                        Suggested tags
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {insight.suggested_tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {insight.issues && insight.issues.length > 0 && (
                    <div className="mt-2 text-xs text-amber-600 dark:text-amber-300">
                      Issues: {insight.issues.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}


