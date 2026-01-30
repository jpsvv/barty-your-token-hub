import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Users,
  Percent,
  DollarSign,
  Check,
  X,
  Clock,
} from "lucide-react";
import { EventInvite } from "@/types/client";

interface EventInviteCardProps {
  invite: EventInvite;
  onAccept: (inviteId: string) => void;
  onDecline: (inviteId: string) => void;
}

const EventInviteCard = ({
  invite,
  onAccept,
  onDecline,
}: EventInviteCardProps) => {
  const formatFee = () => {
    const parts = [];
    if (invite.feeType === "percentage" || invite.feeType === "both") {
      parts.push(`${invite.feePercentage}%`);
    }
    if (invite.feeType === "fixed" || invite.feeType === "both") {
      parts.push(`R$ ${invite.feeFixed?.toFixed(2)}`);
    }
    return parts.join(" + ");
  };

  const acceptedCount = invite.participants.filter(
    (p) => p.status === "accepted"
  ).length;
  const pendingCount = invite.participants.filter(
    (p) => p.status === "pending"
  ).length;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Convite Pendente
                </Badge>
              </div>
              <h3 className="text-xl font-bold">{invite.eventName}</h3>
              <p className="text-sm text-muted-foreground">
                Produtor: {invite.producerName}
              </p>
            </div>

            {/* Event Details */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {invite.eventLocation}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(invite.invitedAt).toLocaleDateString("pt-BR")}
              </div>
            </div>

            {/* Description */}
            {invite.eventDescription && (
              <p className="text-sm text-muted-foreground">
                {invite.eventDescription}
              </p>
            )}

            {/* Fee */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-1">
                {invite.feeType === "percentage" || invite.feeType === "both" ? (
                  <Percent className="h-4 w-4 text-primary" />
                ) : (
                  <DollarSign className="h-4 w-4 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Taxa do Evento</p>
                <p className="text-sm text-muted-foreground">{formatFee()}</p>
              </div>
            </div>

            {/* Participants */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Participantes ({acceptedCount + pendingCount})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {invite.participants.slice(0, 5).map((participant, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-muted rounded-full px-3 py-1"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {participant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{participant.name}</span>
                    {participant.status === "accepted" && (
                      <Check className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                ))}
                {invite.participants.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{invite.participants.length - 5} mais
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onAccept(invite.id)}
            >
              <Check className="h-4 w-4 mr-2" />
              Aceitar
            </Button>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDecline(invite.id)}
            >
              <X className="h-4 w-4 mr-2" />
              Recusar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventInviteCard;
