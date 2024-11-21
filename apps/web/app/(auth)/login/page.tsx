'use client';

import ThemeButton from '@/components/theme-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/authContext';
import { useRef, useState } from 'react';

import { toast } from 'sonner';

export default function Login() {
  const { loginUser } = useAuth();
  const [getResponse, setGetResponse] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    if (!username || !password) {
      toast.error('Username and password are required');
      return;
    }
    if (username.length < 2 || password.length < 4) {
      toast.error('Invalid Credentials');
      return;
    }
    const credentials = { username, password };
    setGetResponse(true);
    try {
      await loginUser(credentials);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Invalid credentials') {
          toast.error('Invalid credentials');
        } else {
          toast.error('Something went wrong');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    }
    setGetResponse(false);
  };
  return (
    <div className="min-h-svh flex justify-center items-center relative overflow-hidden">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="flex justify-between items-center gap-5">
            <h1 className="text-2xl font-bold">Login</h1>
            <ThemeButton />
          </CardTitle>
          <CardDescription>Enter your username and password to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="username" placeholder="Username" required ref={usernameRef} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" required ref={passwordRef} />
            </div>
            <Button type="submit" className="w-full" disabled={getResponse}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
