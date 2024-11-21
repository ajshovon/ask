'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Moon, Send, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Hero() {
  const [message, setMessage] = useState('');
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const msg = message.trim();
    if (!msg) toast.error('Message can not be empty!');
    else {
      // Send the message
      await api.post('/v1/ask', { message: msg });
      setMessage('');
      toast.success('Message sent successfully!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-gray-900 dark:to-purple-900 flex flex-col items-center justify-center px-4 py-8 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg rounded-3xl overflow-hidden dark:border-transparent">
          <div className="p-6 space-y-6">
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
            <motion.div className="flex flex-col items-center text-center" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}>
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-gray-400/60 mb-4">
                <Image src="https://avatars.githubusercontent.com/u/61104583" alt="Shovon's profile picture" fill className="object-cover" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">@shovon</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Send me anonymous messages!</p>
            </motion.div>
            <div className="relative">
              <Textarea disabled={loading} placeholder="Type your anonymous message here..." className="min-h-[120px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-2xl resize-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500  transition-all duration-300 text-gray-800 dark:text-gray-200" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <Button disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-6 rounded-2xl text-lg font-medium transition-all duration-300 ease-in-out" onClick={handleSubmit}>
              <Send className="w-5 h-5 mr-2 dark:text-gray-200 text-gray-200 " />
              <span className="dark:text-gray-200 text-gray-200 "> Send Message</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div className="mt-8 w-full max-w-md space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <div className="flex justify-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Shovon. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}
