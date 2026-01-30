import { useState } from "react";
import { ClientLayout } from "../layouts/ClientLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Plus,
  Calendar,
  Users,
  PartyPopper,
  CheckCircle,
} from "lucide-react";
import { ClientEvent, EventInvite, EventParticipant } from "@/types/client";
import EventInviteCard from "../components/EventInviteCard";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";
import EventDetails from "../components/EventDetails";
import { toast } from "sonner";

// Mock data
const mockInvites: EventInvite[] = [
  {
    id: "inv1",
    eventId: "evt1",
    eventName: "Festival Gastronômico 2024",
    eventDescription:
      "O maior festival gastronômico da cidade! Venha participar e mostrar o melhor da sua cozinha.",
    eventLocation: "Parque da Cidade - São Paulo, SP",
    producerName: "Eventos XYZ",
    feeType: "both",
    feePercentage: 5,
    feeFixed: 500,
    participants: [
      { name: "Bar do João", status: "accepted" },
      { name: "Pizzaria Pedro", status: "accepted" },
      { name: "Restaurante Maria", status: "pending" },
      { name: "Hamburgueria Top", status: "pending" },
    ],
    invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "inv2",
    eventId: "evt2",
    eventName: "Feira de Food Trucks",
    eventDescription: "Edição especial de verão com os melhores food trucks da região.",
    eventLocation: "Shopping Center Norte - São Paulo, SP",
    producerName: "Food Truck Brasil",
    feeType: "percentage",
    feePercentage: 8,
    participants: [
      { name: "Burger King Express", status: "accepted" },
      { name: "Taco Loco", status: "pending" },
    ],
    invitedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

const mockMyEvents: ClientEvent[] = [
  {
    id: "myevt1",
    producerId: "1",
    name: "Festa Junina 2024",
    themeColor: "#F59E0B",
    location: "Praça Central - Centro",
    description: "Festa junina tradicional com comidas típicas",
    operatingHours: [],
    feeType: "percentage",
    feePercentage: 3,
    status: "active",
    participants: [
      {
        clientId: "c1",
        clientName: "Bar do João",
        inviteStatus: "accepted",
        invitedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        respondedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        clientId: "c2",
        clientName: "Pizzaria Pedro",
        inviteStatus: "accepted",
        invitedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        respondedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        clientId: "c3",
        clientName: "Restaurante Maria",
        inviteStatus: "pending",
        invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
  },
  {
    id: "myevt2",
    producerId: "1",
    name: "Oktoberfest 2024",
    themeColor: "#3B82F6",
    location: "Pavilhão de Eventos",
    description: "Festival de cerveja artesanal",
    operatingHours: [],
    feeType: "both",
    feePercentage: 5,
    feeFixed: 300,
    status: "draft",
    participants: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 95 * 24 * 60 * 60 * 1000),
  },
  {
    id: "myevt3",
    producerId: "1",
    name: "Réveillon 2023",
    themeColor: "#8B5CF6",
    location: "Orla da Praia",
    operatingHours: [],
    feeType: "fixed",
    feeFixed: 1000,
    status: "finished",
    participants: [
      {
        clientId: "c1",
        clientName: "Bar do João",
        inviteStatus: "accepted",
        invitedAt: new Date("2023-11-01"),
        respondedAt: new Date("2023-11-05"),
      },
      {
        clientId: "c4",
        clientName: "Hamburgueria Top",
        inviteStatus: "accepted",
        invitedAt: new Date("2023-11-01"),
        respondedAt: new Date("2023-11-03"),
      },
    ],
    createdAt: new Date("2023-10-01"),
    startDate: new Date("2023-12-31"),
    endDate: new Date("2024-01-01"),
  },
];

const ClientEvents = () => {
  const [activeTab, setActiveTab] = useState("invites");
  const [invites, setInvites] = useState<EventInvite[]>(mockInvites);
  const [myEvents, setMyEvents] = useState<ClientEvent[]>(mockMyEvents);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClientEvent | null>(null);

  const handleAcceptInvite = (inviteId: string) => {
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    toast.success("Convite aceito! Você agora faz parte do evento.");
  };

  const handleDeclineInvite = (inviteId: string) => {
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    toast.info("Convite recusado.");
  };

  const handleCreateEvent = (eventData: any) => {
    const newEvent: ClientEvent = {
      id: Date.now().toString(),
      producerId: "1",
      name: eventData.name,
      themeColor: eventData.themeColor,
      location: eventData.location,
      description: eventData.description,
      operatingHours: [],
      feeType: eventData.feeType,
      feePercentage: eventData.feePercentage,
      feeFixed: eventData.feeFixed,
      status: "draft",
      participants: eventData.invitedEstablishments.map((e: any) => ({
        clientId: e.id,
        clientName: e.name,
        inviteStatus: "pending",
        invitedAt: new Date(),
      })),
      createdAt: new Date(),
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate),
    };
    setMyEvents((prev) => [newEvent, ...prev]);
    toast.success("Evento criado com sucesso! Convites enviados aos participantes.");
  };

  const handleViewDetails = (event: ClientEvent) => {
    setSelectedEvent(event);
  };

  const handleGenerateQR = (eventId: string) => {
    const event = myEvents.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleViewReport = (eventId: string) => {
    toast.info("Relatório do evento será implementado na Fase 8");
  };

  const handleCancelEvent = (eventId: string) => {
    setMyEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "cancelled" as const } : e))
    );
    toast.success("Evento cancelado.");
  };

  const handleResendInvite = (eventId: string, clientId: string) => {
    toast.success("Convite reenviado!");
  };

  // Stats
  const activeEvents = myEvents.filter((e) => e.status === "active").length;
  const totalParticipants = myEvents
    .filter((e) => e.status === "active")
    .reduce(
      (sum, e) =>
        sum + e.participants.filter((p) => p.inviteStatus === "accepted").length,
      0
    );

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Eventos</h1>
            <p className="text-muted-foreground">
              Gerencie seus eventos e convites recebidos
            </p>
          </div>
          <Button onClick={() => setIsEventFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Evento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Mail className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Convites</p>
                  <p className="text-xl font-bold">{invites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <PartyPopper className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Eventos Ativos</p>
                  <p className="text-xl font-bold">{activeEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participantes</p>
                  <p className="text-xl font-bold">{totalParticipants}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Eventos</p>
                  <p className="text-xl font-bold">{myEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invites" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Convites Recebidos
              {invites.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {invites.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="my-events" className="flex items-center gap-2">
              <PartyPopper className="h-4 w-4" />
              Meus Eventos
            </TabsTrigger>
          </TabsList>

          {/* Invites Tab */}
          <TabsContent value="invites" className="space-y-4">
            {invites.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Nenhum convite pendente</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Você não possui convites de eventos para responder
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              invites.map((invite) => (
                <EventInviteCard
                  key={invite.id}
                  invite={invite}
                  onAccept={handleAcceptInvite}
                  onDecline={handleDeclineInvite}
                />
              ))
            )}
          </TabsContent>

          {/* My Events Tab */}
          <TabsContent value="my-events" className="space-y-4">
            {myEvents.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <PartyPopper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Nenhum evento criado</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Crie seu primeiro evento e convide estabelecimentos
                    </p>
                    <Button className="mt-4" onClick={() => setIsEventFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Evento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onGenerateQR={handleGenerateQR}
                    onViewReport={handleViewReport}
                    onCancel={handleCancelEvent}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Event Form Modal */}
        <EventForm
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          onSave={handleCreateEvent}
        />

        {/* Event Details Modal */}
        <EventDetails
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onResendInvite={handleResendInvite}
        />
      </div>
    </ClientLayout>
  );
};

export default ClientEvents;
