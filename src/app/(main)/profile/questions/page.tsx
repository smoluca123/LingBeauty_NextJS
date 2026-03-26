import { QuestionsContent } from '@/app/(main)/profile/components';

export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">
        Câu hỏi của tôi
      </h1>
      <QuestionsContent />
    </div>
  );
}
