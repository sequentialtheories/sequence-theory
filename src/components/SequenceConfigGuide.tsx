import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, AlertTriangle, Settings, Shield, Key } from 'lucide-react';
import { validateSequenceConfig, CONFIG_INSTRUCTIONS } from '@/lib/config';

/**
 * Configuration Guide for Sequence Embedded Wallet
 * 
 * This component guides users through the official Sequence Builder setup process
 * as outlined in the Sequence documentation.
 */
export const SequenceConfigGuide = () => {
  const configValidation = validateSequenceConfig();

  const ConfigStep = ({ 
    number, 
    title, 
    description, 
    completed = false,
    icon: Icon,
    variant = "default"
  }: {
    number: number;
    title: string;
    description: string;
    completed?: boolean;
    icon: any;
    variant?: "default" | "warning" | "success";
  }) => (
    <div className="flex items-start space-x-3 p-4 border rounded-lg">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        completed ? 'bg-green-100 text-green-600' : 
        variant === 'warning' ? 'bg-amber-100 text-amber-600' :
        'bg-muted text-muted-foreground'
      }`}>
        {completed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium">Step {number}: {title}</h4>
          {completed && <Badge variant="secondary" className="text-xs">Complete</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Sequence Embedded Wallet Setup</span>
          </CardTitle>
          <CardDescription>
            Follow these steps to configure your Embedded Wallet in Sequence Builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!configValidation.isValid ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">Configuration Required</p>
                  <p>Your Embedded Wallet is not properly configured. Complete the setup steps below.</p>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-6">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Your Sequence Embedded Wallet is properly configured and ready to use!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <ConfigStep
              number={1}
              title="Access Sequence Builder"
              description="Go to Sequence Builder and create or access your project's Embedded Wallet configuration"
              icon={ExternalLink}
              completed={false}
            />

            <ConfigStep
              number={2}
              title="Configure Login Providers"
              description="Set up your preferred login methods (Google, Apple, Email, etc.) and obtain client IDs"
              icon={Key}
              completed={false}
            />

            <ConfigStep
              number={3}
              title="Set Allowed Origins"
              description="Add your development and production URLs to prevent unauthorized usage"
              icon={Shield}
              completed={false}
            />

            <ConfigStep
              number={4}
              title="Configure Recovery Wallet"
              description="Set up a secure multisig wallet address for disaster recovery (cannot be changed later)"
              icon={Shield}
              variant="warning"
              completed={false}
            />

            <ConfigStep
              number={5}
              title="Create Configuration Password"
              description="Set a secure password for your Embedded Wallet configuration (store it safely)"
              icon={Key}
              variant="warning"
              completed={false}
            />

            <ConfigStep
              number={6}
              title="Update Application Config"
              description="Copy your waasConfigKey from Builder and update the application configuration"
              icon={Settings}
              completed={configValidation.isValid}
              variant={configValidation.isValid ? "success" : "default"}
            />
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <a 
                  href={CONFIG_INSTRUCTIONS.builderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Sequence Builder
                </a>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a 
                  href="https://docs.sequence.xyz/solutions/wallets/embedded-wallet/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  View Documentation
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Security Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium">Recovery Wallet</p>
              <p className="text-muted-foreground">Use a secure multisig wallet (like Gnosis Safe) with 2-3+ signers, each protected by hardware wallets.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Key className="h-4 w-4 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Configuration Password</p>
              <p className="text-muted-foreground">Store your configuration password securely - it's required for all future changes.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <ExternalLink className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Allowed Origins</p>
              <p className="text-muted-foreground">Add all development and production URLs to prevent unauthorized access to your configuration.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};