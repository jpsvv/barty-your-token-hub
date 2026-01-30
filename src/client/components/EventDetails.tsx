import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MapPin,
  Calendar,
  Users,
  Percent,
  DollarSign,
  Download,
  Check,
  X,
  Clock,
  Send,
} from "lucide-react";
import { ClientEvent } from "@/types/client";
import { useState } from "react";

interface EventDetailsProps {
  event: ClientEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onResendInvite: (eventId: string, clientId: string) => void;
}

const EventDetails = ({
  event,
  isOpen,
  onClose,
  onResendInvite,
}: EventDetailsProps) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!event) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatFee = () => {
    const parts = [];
    if (event.feeType === "percentage" || event.feeType === "both") {
      parts.push(`${event.feePercentage}%`);
    }
    if (event.feeType === "fixed" || event.feeType === "both") {
      parts.push(`R$ ${event.feeFixed?.toFixed(2)}`);
    }
    return parts.join(" + ");
  };

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

  const getInviteStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-green-500 text-green-950">
            <Check className="h-3 w-3 mr-1" />
            Aceito
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case "declined":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Recusado
          </Badge>
        );
    }
  };

  const eventUrl = `https://barty.app/event/${event.id}`;

  const handleDownloadQR = () => {
    const svg = document.getElementById("event-qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `evento-${event.name}-qrcode.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl">{event.name}</DialogTitle>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="participants">
              Participantes ({event.participants.length})
            </TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <div
              className="h-32 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: event.themeColor + "20" }}
            >
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.name}
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div
                  className="text-4xl font-bold"
                  style={{ color: event.themeColor }}
                >
                  {event.name[0]}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="font-medium">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {event.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                <p className="text-sm">{event.description}</p>
              </div>
            )}

            <Separator />

            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="p-2 bg-background rounded-lg">
                {event.feeType === "percentage" || event.feeType === "both" ? (
                  <Percent className="h-5 w-5 text-primary" />
                ) : (
                  <DollarSign className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa do Evento</p>
                <p className="font-medium">{formatFee()}</p>
              </div>
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estabelecimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Convite</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.participants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum participante convidado
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  event.participants.map((participant) => (
                    <TableRow key={participant.clientId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                            {participant.clientName[0]}
                          </div>
                          <span className="font-medium">
                            {participant.clientName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getInviteStatusBadge(participant.inviteStatus)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(participant.invitedAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        {participant.inviteStatus === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              onResendInvite(event.id, participant.clientId)
                            }
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Reenviar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qrcode">
            <div className="flex flex-col items-center py-6 space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG
                  id="event-qr-code"
                  value={eventUrl}
                  size={200}
                  level="H"
                  includeMargin
                  fgColor={event.themeColor}
                />
              </div>
              <div className="text-center">
                <p className="font-medium">{event.name}</p>
                <p className="text-sm text-muted-foreground">{eventUrl}</p>
              </div>
              <Button onClick={handleDownloadQR}>
                <Download className="h-4 w-4 mr-2" />
                Baixar QR Code
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetails;
