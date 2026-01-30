import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PrintSector } from "@/types/client";

interface PrintSectorFormProps {
  sector?: PrintSector;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sector: Partial<PrintSector>) => void;
}

const PrintSectorForm = ({
  sector,
  isOpen,
  onClose,
  onSave,
}: PrintSectorFormProps) => {
  const [name, setName] = useState(sector?.name || "");
  const [isActive, setIsActive] = useState(sector?.isActive ?? true);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      id: sector?.id,
      name: name.trim(),
      isActive,
    });

    setName("");
    setIsActive(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {sector ? "Editar Setor" : "Novo Setor de Produção"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sectorName">Nome do Setor</Label>
            <Input
              id="sectorName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cozinha, Bar, Churrasqueira..."
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sectorActive">Setor Ativo</Label>
            <Switch
              id="sectorActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintSectorForm;
