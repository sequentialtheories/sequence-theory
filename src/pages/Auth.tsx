import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useValidation } from '@/hooks/useValidation';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { validateEmail, validatePassword, sanitizeInput } = useValidation();

  // Check if there's an email passed from early access signup
  const searchParams = new URLSearchParams(location.search);
  const prefilledEmail = searchParams.get('email');
  useState(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
      setIsLogin(false); // Show signup form for password creation
    }
  });
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    
    // Validate email
    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // For signup, validate password strength
    if (!isLogin) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        toast({
          title: "Password Requirements Not Met",
          description: "Please check the password requirements below.",
          variant: "destructive"
        });
        return;
      }
      setPasswordErrors([]);
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully."
        });
        navigate('/');
      } else {
        // For signup, include sanitized name in metadata
        const { error } = await supabase.auth.signUp({
          email: sanitizedEmail,
          password,
          options: {
            data: {
              name: sanitizedName
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Welcome to Sequence Theory! You can now access all features."
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4 relative">
      {/* Back Arrow */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="absolute top-4 left-4 p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors rounded-full border-2 border-purple-200 hover:border-purple-300 bg-white/50 backdrop-blur-sm">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Join Sequence Theory
          </CardTitle>
          <CardDescription>Create Your Account to Access The Vault Club & More!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} required={!isLogin} />
              </div>}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} disabled={!!prefilledEmail} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  )}
                </Button>
              </div>
              {!isLogin && passwordErrors.length > 0 && (
                <div className="mt-2 text-sm text-destructive space-y-1">
                  {passwordErrors.map((error, index) => (
                    <p key={index}>• {error}</p>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {prefilledEmail ? 'Complete Account' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {!prefilledEmail && <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-0 h-auto font-semibold">
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </div>}
        </CardContent>
      </Card>
    </div>;
}