import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FC, MouseEventHandler, useState } from 'react';
import { PiCornersInDuotone, PiCornersOutDuotone } from 'react-icons/pi';

type CustomDocument = Document & {
  mozCancelFullScreen?: () => void;
};

const FullScreenToggle: FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen: MouseEventHandler<HTMLButtonElement> = () => {
    const doc = document;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen || docEl.requestFullscreen || docEl.requestFullscreen || docEl.requestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || (doc as CustomDocument).mozCancelFullScreen || doc.exitFullscreen || doc.exitFullscreen;

    if (!doc.fullscreenElement) {
      requestFullScreen?.call(docEl);
      setIsFullScreen(true);
    } else {
      cancelFullScreen?.call(doc);
      setIsFullScreen(false);
    }
  };

  return (
    <div className="xl:block hidden">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={toggleFullScreen} variant="ghost" size="icon" className="md:size-9 size-8 hover:bg-[#f1f5f9] dark:hover:bg-[#334155] hover:text-primary text-accent-500 dark:text-accent-800 rounded-full">
              {isFullScreen ? <PiCornersInDuotone className="md:!size-6 !size-5" /> : <PiCornersOutDuotone className="md:!size-6 !size-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-accent-500">{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FullScreenToggle;
