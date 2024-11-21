'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/auth';
import getAPIUrl from '@/lib/env';
import { useAuth } from '@/providers/authContext';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import { Eye, EyeOff, Loader2, LogOut, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PiUserCircleDashedDuotone } from 'react-icons/pi';
import { toast } from 'sonner';

type FormDataType = {
  currentPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export default function Settings() {
  const { logoutUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [getResponse, setGetResponse] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);

  useEffect(() => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }, [newPassword, confirmNewPassword]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as unknown as FormDataType;
    const { currentPassword, confirmNewPassword } = data;

    const dataJSON = { oldPassword: currentPassword, confirmNewPassword };
    try {
      const res = await api.patch(`${getAPIUrl()}/v1/admin/change-password`, dataJSON);
      if (res.status === 200) {
        toast.success('Password changed successfully!');
        setGetResponse(true);
        setIsDialogOpen(false);
      } else {
        toast.error('Something went wrong!');
        setGetResponse(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      if (axios.isAxiosError(error) && error?.response?.status === 401) {
        toast.error('Current password is incorrect.');
      } else toast.error('An error occurred while changing password. Please try again later.');
    }
    setGetResponse(false);
  };
  return (
    <div className="min-h-[80svh] flex justify-center items-center relative overflow-hidden">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="flex justify-between items-center gap-5">
            <h1 className="text-1xl font-semibold">Setting</h1>
          </CardTitle>
          {/* <CardDescription>Enter your username and password to login to your account</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Dialog
              open={isDialogOpen}
              onOpenChange={() => {
                setIsDialogOpen(!isDialogOpen);
                if (!isDialogOpen) {
                  setNewPassword('');
                  setConfirmNewPassword('');
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PiUserCircleDashedDuotone />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-xl">
                <DialogHeader>
                  <DialogTitle className="mb-5">Change Password</DialogTitle>
                  <DialogDescription>
                    <form action="" onSubmit={handleUpdate} className="flex flex-col gap-4">
                      <div className="text-start">
                        <Label>Current Password</Label>
                        <div className="flex items-center mt-2 border border-default rounded-lg">
                          <Input type={showCurrentPass ? 'text' : 'password'} name="currentPassword" placeholder="Write here.." className="border-none" required autoComplete="off" />
                          <button type="button" className="h-10 px-3" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                            {showCurrentPass ? <Eye className="size-4 text-accent-850" /> : <EyeOff className="size-4 text-accent-850" />}
                          </button>
                        </div>
                      </div>
                      <div className="text-start">
                        <Label>New Password</Label>
                        <div className="flex items-center mt-2 border border-default rounded-lg">
                          <Input type={showNewPass ? 'text' : 'password'} name="newPassword" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder="Write here.." className="border-none" autoComplete="off" />
                          <button type="button" className="h-10 px-3" onClick={() => setShowNewPass(!showNewPass)}>
                            {showNewPass ? <Eye className="size-4 text-accent-850" /> : <EyeOff className="size-4 text-accent-850" />}
                          </button>
                        </div>
                      </div>
                      <div className="text-start">
                        <Label>Confirm New Password</Label>
                        <div className="flex items-center mt-2 border border-default rounded-lg">
                          <Input type={showConfirmNewPass ? 'text' : 'password'} name="confirmNewPassword" onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} placeholder="Write here.." className="border-none" autoComplete="off" />
                          <button type="button" className="h-10 px-3" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}>
                            {showConfirmNewPass ? <Eye className="size-4 text-accent-850" /> : <EyeOff className="size-4 text-accent-850" />}
                          </button>
                        </div>
                        {newPassword && confirmNewPassword ? (
                          <>
                            {passwordError && (
                              <span className="text-red-500 text-sm flex items-center gap-2">
                                <X className="size-5" />
                                Confirm password does not match new password.
                              </span>
                            )}
                          </>
                        ) : (
                          ''
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-4 mt-4">
                        <button type="submit" disabled={getResponse} value="submitButton" className="rounded-md bg-primary px-4 py-2 text-white font-medium flex items-center gap-2 active:scale-95 duration-300 transition-all">
                          {getResponse && <Loader2 className="size-4 animate-spin" />}
                          {getResponse ? 'Updating...' : 'Update'}
                        </button>
                      </div>
                    </form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button type="button" className="w-full" onClick={() => logoutUser()}>
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
