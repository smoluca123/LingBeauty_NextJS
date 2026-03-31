import { Button } from '@/components/ui/button'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface BlogTopicFilterProps {
  topics: IBlogTopicDataType[]
  selectedTopicId: string | null
  onSelectTopic: (id: string | null) => void
}

export function BlogTopicFilter({
  topics,
  selectedTopicId,
  onSelectTopic,
}: BlogTopicFilterProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Chủ đề</h3>
      <div className="flex flex-col gap-1">
        <Button
          variant={selectedTopicId === null ? 'primary-pink' : 'ghost'}
          className="justify-start"
          onClick={() => onSelectTopic(null)}
        >
          Tất cả
        </Button>
        {topics.map((topic) => (
          <Button
            key={topic.id}
            variant={selectedTopicId === topic.id ? 'primary-pink' : 'ghost'}
            className="justify-start"
            onClick={() => onSelectTopic(topic.id)}
          >
            {topic.name}
            {topic.postCount !== undefined && (
              <span className="ml-auto text-xs text-muted-foreground">
                ({topic.postCount})
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
