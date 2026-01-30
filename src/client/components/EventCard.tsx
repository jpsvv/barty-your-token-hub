import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  QrCode,
  BarChart3,
  Settings,
  XCircle,
} from "lucide-react";
import { ClientEvent } from "@/types/client";

interface EventCardProps {
  event: ClientEvent;
  onViewDetails: (event: ClientEvent) => void;
  onGenerateQR: (eventId: string) => void;
  onViewReport: (eventId: string) => void;
  onCancel: (eventId: string) => void;
}

const EventCard = ({
  event,
  onViewDetails,
  onGenerateQR,
  onViewReport,
  onCancel,
}: EventCardProps) => {
  const getStatusBadge = () => {
    switch (event.status) {
      case "draft":
        return <Badge variant="secondary">Rascunho</Badge>;
      case "active":
        return <Badge className="bg-green-500 text-green-950">Ativo</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      case "finished":
        return <Badge variant="outline">Finalizado</Badge>;
    }
  };

  const formatDateRange = () => {
    const start = new Date(event.startDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    const end = new Date(event.endDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${start} a ${end}`;
  };

  const acceptedParticipants = event.participants.filter(
    (p) => p.inviteStatus === "accepted"
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getStatusBadge()}
            </div>
            <h3 className="text-lg font-bold">{event.name}</h3>
          </div>
          {event.logo && (
            <img
              src={event.logo}
              alt={event.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDateRange()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {acceptedParticipants.length} estabelecimento(s) confirmado(s)
            </span>
          </div>
        </div>

        {/* Participants Preview */}
        {acceptedParticipants.length > 0 && (
          <div className="flex -space-x-2 mb-4">
            {acceptedParticipants.slice(0, 4).map((participant) => (
              <div
                key={participant.clientId}
                className="h-8 w-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                title={participant.clientName}
              >
                {participant.clientName[0]}
              </div>
            ))}
            {acceptedParticipants.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                +{acceptedParticipants.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(event)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Detalhes
          </Button>
          {event.status === "active" && (
            <>
              <Button size="sm" variant="outline" onClick={() => onGenerateQR(event.id)}>
                <QrCode className="h-4 w-4 mr-1" />
                QR Code
              </Button>
              <Button size="sm" variant="outline" onClick={() => onViewReport(event.id)}>
                <BarChart3 className="h-4 w-4 mr-1" />
                Relatório
              </Button>
            </>
          )}
          {(event.status === "draft" || event.status === "active") && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onCancel(event.id)}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
