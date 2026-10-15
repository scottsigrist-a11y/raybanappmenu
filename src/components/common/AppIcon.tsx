import React, { useState } from 'react';
import {
  FileText,
  Compass,
  Timer,
  CheckSquare,
  Sun,
  Globe,
  Sparkles,
  MapPin,
  Activity,
  Terminal,
  BookOpen,
  Music,
  Layers,
  Code2,
  Calendar,
  MessageSquare,
  Cpu,
  Bookmark,
  Zap,
  Box,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Compass,
  Timer,
  CheckSquare,
  Sun,
  Globe,
  Sparkles,
  MapPin,
  Activity,
  Terminal,
  BookOpen,
  Music,
  Layers,
  Code2,
  Calendar,
  MessageSquare,
  Cpu,
  Bookmark,
  Zap,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

interface AppIconProps {
  name: string;
  className?: string;
  isHudWaveguide?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  className = 'w-5 h-5',
  isHudWaveguide = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const isUrl =
    !imgError &&
    name &&
    (name.startsWith('http://') ||
      name.startsWith('https://') ||
      name.startsWith('data:') ||
      name.includes('favicons'));

  if (isUrl) {
    return (
      <img
        src={name}
        alt="App icon"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${className} object-contain rounded-md ${
          isHudWaveguide ? 'brightness-110 contrast-125' : ''
        }`}
      />
    );
  }

  const IconComponent = ICON_MAP[name] || Globe;
  return <IconComponent className={className} />;
};
