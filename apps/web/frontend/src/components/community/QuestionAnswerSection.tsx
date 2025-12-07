import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { Card, CardBody, Button, Input } from '../ui';
import type { Question } from '../../types/community';

interface QuestionAnswerSectionProps {
  questions: Question[];
}

export function QuestionAnswerSection({ questions }: QuestionAnswerSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(questions[0]?.id ?? null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="space-y-5" id="qa">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-500 dark:text-purple-300">
            Product Q&A
          </p>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Ask the community
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get sizing tips, compatibility answers, and real-world impressions from fellow shoppers and the Easy11 team.
          </p>
        </div>
        <Button variant="primary" size="md" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Ask a question
        </Button>
      </header>

      <Input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search existing questions (e.g. multipoint pairing, return policy)"
      />

      <div className="space-y-4">
        {filtered.map((question) => {
          const isOpen = expanded === question.id;
          return (
            <Card
              key={question.id}
              className="border border-gray-200 dark:border-gray-700"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setExpanded(isOpen ? null : question.id)}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{question.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Asked by {question.asker.name} · {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              {isOpen && (
                <CardBody className="space-y-4 border-t border-gray-100 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900/40">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{question.body}</p>
                  <div className="space-y-3">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="rounded-xl border border-transparent bg-white p-4 shadow-sm dark:bg-gray-900"
                      >
                        <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {answer.responder.name}
                            {answer.responder.role === 'seller' && ' · Seller'}
                            {answer.responder.role === 'staff' && ' · Easy11 Team'}
                            {answer.responder.role === 'customer' && ' · Customer'}
                          </span>
                          <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{answer.body}</p>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{answer.upvotes} found this helpful</span>
                          {answer.isAccepted && (
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                              Accepted answer
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              )}
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No questions match that keyword yet. Start the conversation to get real-time answers once community moderation approves it.
          </p>
        )}
      </div>
    </section>
  );
}


