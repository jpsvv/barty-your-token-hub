import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  // Etapa 1 - Responsável
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  password: string;
  confirmPassword: string;
  // Etapa 2 - Estabelecimento
  cnpj: string;
  companyName: string;
  tradingName: string;
  // Etapa 3 - Contato
  address: string;
  phone: string;
  website: string;
  // Etapa 4 - Descrição
  description: string;
}

const initialFormData: FormData = {
  responsibleName: '',
  responsibleEmail: '',
  responsiblePhone: '',
  password: '',
  confirmPassword: '',
  cnpj: '',
  companyName: '',
  tradingName: '',
  address: '',
  phone: '',
  website: '',
  description: '',
};

const steps = [
  { title: 'Responsável', description: 'Dados do administrador' },
  { title: 'Estabelecimento', description: 'Dados da empresa' },
  { title: 'Contato', description: 'Endereço e contato' },
  { title: 'Descrição', description: 'Sobre o estabelecimento' },
];

export default function ClientSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!formData.responsibleName || !formData.responsibleEmail || !formData.password) {
          toast({ title: 'Erro', description: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: 'Erro', description: 'As senhas não coincidem', variant: 'destructive' });
          return false;
        }
        break;
      case 1:
        if (!formData.cnpj || !formData.companyName || !formData.tradingName) {
          toast({ title: 'Erro', description: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
          return false;
        }
        break;
      case 2:
        if (!formData.address) {
          toast({ title: 'Erro', description: 'Preencha o endereço', variant: 'destructive' });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    
    // Simula cadastro
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    toast({
      title: 'Cadastro realizado!',
      description: 'Seu estabelecimento foi cadastrado. Aguarde a aprovação.',
    });
    navigate('/client');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="responsibleName">Nome completo *</Label>
              <Input
                id="responsibleName"
                placeholder="João da Silva"
                value={formData.responsibleName}
                onChange={(e) => updateField('responsibleName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsibleEmail">Email *</Label>
              <Input
                id="responsibleEmail"
                type="email"
                placeholder="joao@empresa.com"
                value={formData.responsibleEmail}
                onChange={(e) => updateField('responsibleEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsiblePhone">Telefone</Label>
              <Input
                id="responsiblePhone"
                placeholder="(11) 99999-9999"
                value={formData.responsiblePhone}
                onChange={(e) => updateField('responsiblePhone', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={(e) => updateField('cnpj', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Razão Social *</Label>
              <Input
                id="companyName"
                placeholder="Empresa Ltda"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradingName">Nome Fantasia *</Label>
              <Input
                id="tradingName"
                placeholder="Meu Estabelecimento"
                value={formData.tradingName}
                onChange={(e) => updateField('tradingName', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço completo *</Label>
              <Input
                id="address"
                placeholder="Rua, número, bairro, cidade - UF"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone do estabelecimento</Label>
              <Input
                id="phone"
                placeholder="(11) 3333-3333"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Site ou Instagram</Label>
              <Input
                id="website"
                placeholder="https://instagram.com/seubar"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do estabelecimento</Label>
              <Textarea
                id="description"
                placeholder="Conte um pouco sobre o seu estabelecimento, especialidades, ambiente..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={5}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Após o cadastro, você poderá adicionar logo, imagens e configurar horários de funcionamento.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-background to-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Store className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Cadastrar Estabelecimento</CardTitle>
          <CardDescription>
            {steps[currentStep].title} - {steps[currentStep].description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress Steps */}
          <div className="mb-8 flex justify-between">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-1 items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Finalizar
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/client" className="text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
