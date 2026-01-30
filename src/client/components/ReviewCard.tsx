import { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ClientReview } from '@/types/client';

interface ReviewCardProps {
  review: ClientReview;
  onReply: (reviewId: string, reply: string) => void;
}

export function ReviewCard({ review, onReply }: ReviewCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState(review.reply || '');

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(review.id, replyText);
      setIsReplying(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-500 text-yellow-500'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.userAvatar} />
            <AvatarFallback>
              {review.userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{review.userName}</p>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>

            {/* Reply Section */}
            {review.reply && !isReplying ? (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Sua resposta • {review.repliedAt && new Date(review.repliedAt).toLocaleDateString('pt-BR')}
                </p>
                <p className="mt-1 text-sm">{review.reply}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={() => setIsReplying(true)}
                >
                  Editar resposta
                </Button>
              </div>
            ) : isReplying ? (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Escreva sua resposta..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyText(review.reply || '');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSubmitReply}>
                    <Send className="mr-2 h-3 w-3" />
                    Responder
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setIsReplying(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Responder
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
