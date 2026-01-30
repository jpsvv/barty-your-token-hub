import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Palette,
  Percent,
  DollarSign,
  Users,
  Search,
  Plus,
  X,
  Image,
} from "lucide-react";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: EventFormData) => void;
}

interface EventFormData {
  name: string;
  location: string;
  description: string;
  themeColor: string;
  startDate: string;
  endDate: string;
  feeType: "percentage" | "fixed" | "both";
  feePercentage?: number;
  feeFixed?: number;
  invitedEstablishments: { id: string; name: string }[];
}

// Mock establishments to invite
const mockEstablishments = [
  { id: "e1", name: "Bar do João", type: "Bar" },
  { id: "e2", name: "Pizzaria Pedro", type: "Pizzaria" },
  { id: "e3", name: "Restaurante Maria", type: "Restaurante" },
  { id: "e4", name: "Hamburgueria Top", type: "Hamburgueria" },
  { id: "e5", name: "Sushi House", type: "Japonês" },
  { id: "e6", name: "Churrascaria Gaúcha", type: "Churrascaria" },
];

const EventForm = ({ isOpen, onClose, onSave }: EventFormProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [themeColor, setThemeColor] = useState("#8B5CF6");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [useFeePercentage, setUseFeePercentage] = useState(true);
  const [useFeeFixed, setUseFeeFixed] = useState(false);
  const [feePercentage, setFeePercentage] = useState(5);
  const [feeFixed, setFeeFixed] = useState(500);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstablishments, setSelectedEstablishments] = useState<
    { id: string; name: string }[]
  >([]);

  const filteredEstablishments = mockEstablishments.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedEstablishments.find((s) => s.id === e.id)
  );

  const handleAddEstablishment = (establishment: { id: string; name: string }) => {
    setSelectedEstablishments((prev) => [...prev, establishment]);
    setSearchTerm("");
  };

  const handleRemoveEstablishment = (id: string) => {
    setSelectedEstablishments((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSave = () => {
    let feeType: "percentage" | "fixed" | "both" = "percentage";
    if (useFeePercentage && useFeeFixed) feeType = "both";
    else if (useFeeFixed) feeType = "fixed";

    onSave({
      name,
      location,
      description,
      themeColor,
      startDate,
      endDate,
      feeType,
      feePercentage: useFeePercentage ? feePercentage : undefined,
      feeFixed: useFeeFixed ? feeFixed : undefined,
      invitedEstablishments: selectedEstablishments,
    });

    // Reset form
    setName("");
    setLocation("");
    setDescription("");
    setThemeColor("#8B5CF6");
    setStartDate("");
    setEndDate("");
    setUseFeePercentage(true);
    setUseFeeFixed(false);
    setFeePercentage(5);
    setFeeFixed(500);
    setSelectedEstablishments([]);
    setActiveTab("info");
    onClose();
  };

  const isValid =
    name.trim() &&
    location.trim() &&
    startDate &&
    endDate &&
    (useFeePercentage || useFeeFixed);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="fees">Taxas</TabsTrigger>
            <TabsTrigger value="participants">Participantes</TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="eventName">Nome do Evento</Label>
                <Input
                  id="eventName"
                  placeholder="Ex: Festival Gastronômico 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="eventLocation">Localização</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="eventLocation"
                    placeholder="Endereço do evento"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data Início</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data Fim</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="eventDescription">Descrição</Label>
                <Textarea
                  id="eventDescription"
                  placeholder="Descreva o evento..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="themeColor">Cor do Tema</Label>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="themeColor"
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">
                    {themeColor}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure as taxas que serão cobradas dos estabelecimentos
              participantes do evento.
            </p>

            <Separator />

            <div className="space-y-4">
              {/* Percentage Fee */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Percent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="text-base">Taxa Percentual</Label>
                    <p className="text-sm text-muted-foreground">
                      Cobrar um percentual sobre o faturamento
                    </p>
                    {useFeePercentage && (
                      <div className="mt-3 flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={feePercentage}
                          onChange={(e) =>
                            setFeePercentage(parseFloat(e.target.value) || 0)
                          }
                          className="w-24"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    )}
                  </div>
                </div>
                <Switch
                  checked={useFeePercentage}
                  onCheckedChange={setUseFeePercentage}
                />
              </div>

              {/* Fixed Fee */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <Label className="text-base">Taxa Fixa</Label>
                    <p className="text-sm text-muted-foreground">
                      Cobrar um valor fixo de participação
                    </p>
                    {useFeeFixed && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm">R$</span>
                        <Input
                          type="number"
                          min={0}
                          value={feeFixed}
                          onChange={(e) =>
                            setFeeFixed(parseFloat(e.target.value) || 0)
                          }
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Switch checked={useFeeFixed} onCheckedChange={setUseFeeFixed} />
              </div>
            </div>

            {/* Summary */}
            {(useFeePercentage || useFeeFixed) && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Resumo das Taxas:</p>
                <p className="text-sm text-muted-foreground">
                  {useFeePercentage && useFeeFixed
                    ? `${feePercentage}% do faturamento + R$ ${feeFixed.toFixed(2)} fixo`
                    : useFeePercentage
                    ? `${feePercentage}% do faturamento`
                    : `R$ ${feeFixed.toFixed(2)} fixo`}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Convide estabelecimentos para participar do seu evento.
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estabelecimentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {filteredEstablishments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum estabelecimento encontrado
                  </p>
                ) : (
                  filteredEstablishments.map((establishment) => (
                    <div
                      key={establishment.id}
                      className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer"
                      onClick={() => handleAddEstablishment(establishment)}
                    >
                      <div>
                        <p className="font-medium">{establishment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {establishment.type}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}

            <Separator />

            {/* Selected Establishments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                <Label>Estabelecimentos Convidados ({selectedEstablishments.length})</Label>
              </div>
              {selectedEstablishments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum estabelecimento selecionado
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedEstablishments.map((establishment) => (
                    <Badge
                      key={establishment.id}
                      variant="secondary"
                      className="pl-3 pr-1 py-1.5"
                    >
                      {establishment.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 hover:bg-destructive/20"
                        onClick={() => handleRemoveEstablishment(establishment.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Criar Evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
