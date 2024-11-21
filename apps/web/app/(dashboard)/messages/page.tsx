'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/auth';
import getAPIUrl from '@/lib/env';
import { toPng } from 'html-to-image';
import { Download, ImageIcon, MessageSquare, Share, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

interface Message {
  id: number;
  message: string;
  created_at: string;
  status: 'unread' | 'opened' | 'answered';
}

interface ApiResponse {
  status: string;
  data: Message[];
  count: number;
}

interface DetailedMessage {
  id: number;
  message: string;
  answer: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const fetcher = (url: string) => api.get(url).then((r) => r.data);
  const { data: response, error, isLoading } = useSWR<ApiResponse>(`${getAPIUrl()}/v1/admin/messages`, fetcher);
  const [messageDetails, setMessageDetails] = useState<DetailedMessage | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedMessage && isReplyDialogOpen) {
      api.get(`${getAPIUrl()}/v1/admin/messages/${selectedMessage.id}`).then((r) => setMessageDetails(r.data.data));
    }
  }, [selectedMessage, isReplyDialogOpen, setMessageDetails]);

  const handleReply = async () => {
    if (!reply) {
      toast.error('Please enter a reply message.');
      return;
    }
    if (selectedMessage) {
      await api.patch(`${getAPIUrl()}/v1/admin/messages/${selectedMessage.id}`, { answer: reply });
      setIsReplyDialogOpen(false);
      setIsShareDialogOpen(true);
    }
  };

  const handleGenerateImage = async () => {
    if (imageRef.current) {
      try {
        const dataUrl = await toPng(imageRef.current, {
          quality: 0.95,
          width: 1080,
          height: 1920,
        });
        setGeneratedImage(dataUrl);
        toast.success('Image generated successfully');
      } catch (error) {
        console.error('Error generating image:', error);
        toast.error('Failed to generate image');
      }
    }
  };

  const handleShareToInstagram = async () => {
    try {
      if (imageRef.current) {
        const dataUrl = generatedImage || (await toPng(imageRef.current, { quality: 0.95 }));
        const blob = await (await fetch(dataUrl)).blob();
        const fileName = selectedMessage ? `ask-reply-${selectedMessage.id}.png` : messageDetails ? `ask-reply-${messageDetails.id}.png` : 'ask-reply.png';
        const file = new File([blob], fileName, { type: blob.type });

        const shareData = {
          title: 'Reply Image',
          text: 'Check out this reply!',
          files: [file],
          url: document.location.origin,
        };
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          toast.error('Sharing is not supported on this device. Download the image instead.');
        }
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      toast.error('Failed to share the image. Try downloading it instead.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-blue-400">Unread</Badge>;
      case 'opened':
        return <Badge variant="secondary">Opened</Badge>;
      case 'answered':
        return <Badge className="bg-green-400">Answered</Badge>;
      default:
        return null;
    }
  };

  const MessageCard = ({ message }: { message: Message }) => (
    <Card className={`mb-4 ${message.status === 'unread' && 'border-blue-400 border-[1px]'}  `}>
      <CardHeader className="flex flex-row gap-4 justify-between items-center space-y-2 sm:space-y-0 p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Avatar className="size-8 sm:size-10">
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-medium">Anonymous</CardTitle>
            <p className="text-xs text-gray-400">{new Date(message.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace('am', 'AM').replace('pm', 'PM')}</p>
          </div>
        </div>
        <span> {getStatusBadge(message.status)}</span>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <p className="mb-2 ">{message.message}</p>
        <div className="flex justify-end">
          <button
            className="w-auto text-xs flex items-center gap-2  border border-blue-500 hover:border-blue-600 px-2 py-1 rounded-md"
            onClick={() => {
              setSelectedMessage(message);
              setIsReplyDialogOpen(true);
            }}
          >
            <MessageSquare className="size-3 " />
            {message.status === 'answered' ? 'View Reply' : 'Reply'}
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading messages...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load messages.</p>
          ) : response && response.data.length > 0 ? (
            <ScrollArea className="h-[70svh] sm:h-[78svh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {response.data.map((message) => (
                  <div key={message.id}>
                    <MessageCard message={message} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-gray-500">No messages available.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription hidden></DialogDescription>
          </DialogHeader>
          <div className="flex justify-between items-center gap-4 py-4">
            <Avatar>
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">Anonymous</CardTitle>
              <p className="text-xs text-muted-foreground">{new Date(selectedMessage?.created_at ?? '').toLocaleString()}</p>
            </div>
            {getStatusBadge(selectedMessage?.status || '')}
          </div>
          <div className="grid gap-4 py-4">
            {selectedMessage && <p className=" text-muted-foreground">Message: {selectedMessage.message}</p>}
            <Textarea placeholder="Type your reply here..." value={messageDetails?.status === 'answered' ? messageDetails?.answer ?? '' : reply} disabled={messageDetails?.status === 'answered'} onChange={(e) => setReply(e.target.value)} rows={4} />
            {messageDetails?.status !== 'answered' && <Button onClick={handleReply}>Send Reply</Button>}
            {messageDetails?.status == 'answered' && (
              <Button onClick={() => setIsShareDialogOpen(true)}>
                <Share />
                Share
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share to Instagram */}
      <Dialog
        open={isShareDialogOpen}
        onOpenChange={() => {
          setGeneratedImage(null);
          setIsShareDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[725px] w-[95vw]">
          <DialogHeader>
            <DialogTitle>Share to Instagram</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Display scaled-down preview in the modal */}
            <div className="relative w-full max-h-[60vh] overflow-hidden rounded-lg flex items-center justify-center">
              {selectedMessage && (
                <div className="grid gap-6 py-6">
                  <Card className="relative flex max-h-[70vh] w-full items-center justify-center overflow-hidden">
                    <div className="w-[1080px] scale-[0.7]">
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-12">
                        <Card className="w-5/6 overflow-hidden rounded-3xl bg-white/90 shadow-xl backdrop-blur-md">
                          <div className="bg-gray-100/80 p-6">
                            <h2 className="text-center text-3xl font-semibold text-gray-800">Question</h2>
                          </div>
                          <div className="p-8">
                            <p className="mb-8 text-center text-4xl font-bold text-gray-900">{selectedMessage?.message}</p>
                          </div>
                          <div className="bg-gray-100/80 p-6">
                            <h2 className="text-center text-3xl font-semibold text-gray-800">Reply</h2>
                          </div>
                          <div className="p-8">
                            <p className="text-center text-4xl font-semibold text-gray-900">{messageDetails?.answer || reply}</p>
                          </div>
                        </Card>
                        <div className="mt-8 rounded-full bg-white/20 px-6 py-2 text-2xl font-medium text-white backdrop-blur-sm">ask.shovon.me</div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {!generatedImage && (
                <Button onClick={handleGenerateImage} className="flex-1">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate Image
                </Button>
              )}
              {generatedImage && (
                <>
                  <Button asChild variant="secondary" className="flex-1">
                    <a href={generatedImage} download={selectedMessage ? `ask-reply-${selectedMessage.id}.png` : messageDetails ? `ask-reply-${messageDetails.id}.png` : 'ask-reply.png'}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </a>
                  </Button>
                  <Button onClick={handleShareToInstagram} className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share to Instagram
                  </Button>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center">Generate and download the image, then share it on your Instagram story!</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden component for image generation */}
      <div style={{ display: 'none' }}>
        <div className="grid gap-6 py-6">
          <Card className="relative flex max-h-[70vh] w-full items-center justify-center overflow-hidden">
            <div className=" w-[1080px] scale-[0.7]">
              <div ref={imageRef} className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl p-12">
                <Card className="w-5/6 overflow-hidden rounded-3xl bg-white/90 shadow-xl backdrop-blur-md">
                  <div className="bg-gray-100/80 p-6">
                    <h2 className="text-center text-3xl font-semibold text-gray-800">Question</h2>
                  </div>
                  <div className="p-8">
                    <p className="mb-8 text-center text-4xl font-bold text-gray-900">{selectedMessage?.message}</p>
                  </div>
                  <div className="bg-gray-100/80 p-6">
                    <h2 className="text-center text-3xl font-semibold text-gray-800">Reply</h2>
                  </div>
                  <div className="p-8">
                    <p className="text-center text-4xl font-semibold text-gray-900">{messageDetails?.answer || reply}</p>
                  </div>
                </Card>
                <div className="mt-8 rounded-full bg-white/20 px-6 py-2 text-2xl font-medium text-white backdrop-blur-sm">ask.shovon.me</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
