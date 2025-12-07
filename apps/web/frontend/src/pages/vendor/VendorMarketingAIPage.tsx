import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Loader2, Copy, Check, PenTool } from 'lucide-react';
import { Button, Card, CardBody, Badge } from '../../components/ui';
import { useMarketingStore } from '../../store/marketingStore';
import type { AIContentRequest } from '../../types/marketing';

const toneOptions: AIContentRequest['tone'][] = ['friendly', 'professional', 'playful', 'technical'];
const lengthOptions: AIContentRequest['length'][] = ['short', 'medium', 'long'];
const audienceOptions: AIContentRequest['target_audience'][] = ['customers', 'vendors', 'general'];

export default function VendorMarketingAIPage() {
  const [topic, setTopic] = useState('Product Launch Announcement');
  const [keywordsInput, setKeywordsInput] = useState('commerce, loyalty, personalization');
  const [tone, setTone] = useState<AIContentRequest['tone']>('friendly');
  const [length, setLength] = useState<AIContentRequest['length']>('medium');
  const [targetAudience, setTargetAudience] = useState<AIContentRequest['target_audience']>('customers');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const {
    generateAIContent,
    aiGeneratedContent,
    isGeneratingContent,
    error,
  } = useMarketingStore((state) => ({
    generateAIContent: state.generateAIContent,
    aiGeneratedContent: state.aiGeneratedContent,
    isGeneratingContent: state.isGeneratingContent,
    error: state.error,
  }));

  const handleGenerate = async () => {
    const request: AIContentRequest = {
      topic,
      keywords: keywordsInput
        .split(',')
        .map((kw) => kw.trim())
        .filter(Boolean),
      tone,
      length,
      include_examples: includeExamples,
      target_audience: targetAudience,
    };
    await generateAIContent(request);
    setCopiedSection(null);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(key);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const seoBadgeColor = useMemo(() => {
    if (!aiGeneratedContent) return 'bg-gray-200 text-gray-800';
    if (aiGeneratedContent.seo_score >= 85) return 'bg-emerald-100 text-emerald-700';
    if (aiGeneratedContent.seo_score >= 70) return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  }, [aiGeneratedContent]);

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300">
                Generative Studio
              </p>
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Build campaigns with AI in minutes
              </h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Feed the assistant a topic and preferred tone. We will craft long-form copy, SEO metadata,
            and multi-channel variations ready for email, SMS, and social.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-1 space-y-6">
            <Card>
              <CardBody className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Topic
                  </label>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Spring Flash Sale"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Keywords (comma separated)
                  </label>
                  <input
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    placeholder="loyalty, personalization, shipping"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as AIContentRequest['tone'])}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    >
                      {toneOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Length
                    </label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value as AIContentRequest['length'])}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    >
                      {lengthOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Audience
                    </label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value as AIContentRequest['target_audience'])}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    >
                      {audienceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-3 mt-2 md:mt-8 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeExamples}
                      onChange={(e) => setIncludeExamples(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include activation examples</span>
                  </label>
                </div>

                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGenerate}
                  disabled={isGeneratingContent}
                >
                  {isGeneratingContent ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Campaign Kit
                    </>
                  )}
                </Button>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
              </CardBody>
            </Card>

            {aiGeneratedContent && (
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-sm">
                  <span className="font-semibold">Image prompt:</span> {aiGeneratedContent.image_prompt}
                </p>
              </div>
            )}
          </section>

          <section className="xl:col-span-2 space-y-6">
            {!aiGeneratedContent && !isGeneratingContent && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                <PenTool className="w-12 h-12 text-blue-500 dark:text-blue-300 mx-auto mb-4" />
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  Generate your first campaign asset
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                  Outline the brief and we’ll deliver SEO-ready copy, channel variants, and meta tags in seconds.
                </p>
              </div>
            )}

            {isGeneratingContent && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">Crafting copy and channel variations…</p>
              </div>
            )}

            {aiGeneratedContent && !isGeneratingContent && (
              <>
                <Card>
                  <CardBody className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                          {aiGeneratedContent.title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tone: {aiGeneratedContent.tone ?? tone} · Target: {aiGeneratedContent.target_audience ?? targetAudience}
                        </p>
                      </div>
                      <Badge className={seoBadgeColor} size="sm">
                        SEO Score {aiGeneratedContent.seo_score}
                      </Badge>
                    </div>

                    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Meta title</span>
                        <CopyButton
                          label="Copy"
                          isCopied={copiedSection === 'meta_title'}
                          onCopy={() => copyToClipboard(aiGeneratedContent.meta_title, 'meta_title')}
                        />
                      </div>
                      <p>{aiGeneratedContent.meta_title}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Meta description</span>
                        <CopyButton
                          label="Copy"
                          isCopied={copiedSection === 'meta_description'}
                          onCopy={() => copyToClipboard(aiGeneratedContent.meta_description, 'meta_description')}
                        />
                      </div>
                      <p>{aiGeneratedContent.meta_description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Keywords</span>
                        <CopyButton
                          label="Copy"
                          isCopied={copiedSection === 'keywords'}
                          onCopy={() => copyToClipboard(aiGeneratedContent.suggested_keywords.join(', '), 'keywords')}
                        />
                      </div>
                      <p>{aiGeneratedContent.suggested_keywords.join(', ')}</p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Outline</h3>
                      <CopyButton
                        label="Copy outline"
                        isCopied={copiedSection === 'outline'}
                        onCopy={() => copyToClipboard(aiGeneratedContent.outline.join('\n'), 'outline')}
                      />
                    </div>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc pl-5">
                      {aiGeneratedContent.outline.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Long-form Copy</h3>
                      <CopyButton
                        label="Copy body"
                        isCopied={copiedSection === 'content'}
                        onCopy={() => copyToClipboard(aiGeneratedContent.content, 'content')}
                      />
                    </div>
                    <article className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {aiGeneratedContent.content}
                    </article>
                  </CardBody>
                </Card>

                {aiGeneratedContent.channel_variations && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiGeneratedContent.channel_variations.map((variation, index) => (
                      <Card key={`${variation.channel}-${index}`} className="border border-blue-200 dark:border-blue-800">
                        <CardBody className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="info" size="sm">
                              {variation.channel.toUpperCase()}
                            </Badge>
                            <CopyButton
                              label="Copy"
                              isCopied={copiedSection === `${variation.channel}-${index}`}
                              onCopy={() =>
                                copyToClipboard(
                                  `${variation.headline}\n\n${variation.subheadline ?? ''}\n\n${variation.body}\n\nCTA: ${variation.call_to_action}`,
                                  `${variation.channel}-${index}`
                                )
                              }
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                              {variation.headline}
                            </h4>
                            {variation.subheadline && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{variation.subheadline}</p>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{variation.body}</p>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">CTA: {variation.call_to_action}</p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  );
}

interface CopyButtonProps {
  label: string;
  isCopied: boolean;
  onCopy: () => void;
}

function CopyButton({ label, isCopied, onCopy }: CopyButtonProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
    >
      {isCopied ? (
        <>
          <Check className="w-4 h-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}


