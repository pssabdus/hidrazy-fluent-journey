import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Drama, 
  Award, 
  User, 
  Zap, 
  MessageCircle, 
  TrendingUp, 
  BarChart3, 
  Download,
  Crown,
  Settings
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { UsageTracker } from '@/components/premium/UsageTracker';

interface AppSidebarProps {
  activeTab: 'home' | 'journey' | 'roleplay' | 'exercises' | 'razia' | 'progress' | 'analytics' | 'premium' | 'offline' | 'ielts' | 'profile';
  onTabChange: (tab: 'home' | 'journey' | 'roleplay' | 'exercises' | 'razia' | 'progress' | 'analytics' | 'premium' | 'offline' | 'ielts' | 'profile') => void;
  showIELTS: boolean;
}

export function AppSidebar({ activeTab, onTabChange, showIELTS }: AppSidebarProps) {
  const { state } = useSidebar();

  const mainItems = [
    { id: 'home' as const, label: 'Dashboard', icon: Home, isPremium: false },
    { id: 'razia' as const, label: 'Chat with Razia', icon: MessageCircle, isPremium: false },
    { id: 'exercises' as const, label: 'Exercises', icon: Zap, isPremium: false },
    { id: 'roleplay' as const, label: 'Role Play', icon: Drama, isPremium: false },
  ];

  const learningItems = [
    { id: 'progress' as const, label: 'Progress', icon: TrendingUp, isPremium: false },
    { id: 'analytics' as const, label: 'Advanced Analytics', icon: BarChart3, isPremium: true },
    { id: 'premium' as const, label: 'Premium Features', icon: Crown, isPremium: false },
    { id: 'offline' as const, label: 'Offline Learning', icon: Download, isPremium: true },
    ...(showIELTS ? [{ id: 'ielts' as const, label: 'IELTS Mastery', icon: Award, isPremium: true }] : []),
  ];

  const accountItems = [
    { id: 'journey' as const, label: 'Learning Journey', icon: Map, isPremium: false },
    { id: 'profile' as const, label: 'Profile & Settings', icon: User, isPremium: false },
  ];

  const renderMenuItem = (item: any) => (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton 
        asChild
        className={activeTab === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"}
      >
        <div 
          onClick={() => onTabChange(item.id)}
          className="flex items-center cursor-pointer w-full"
        >
          <item.icon className="h-4 w-4" />
          {state !== 'collapsed' && (
            <div className="flex items-center justify-between w-full ml-2">
              <span>{item.label}</span>
              {item.isPremium && (
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 ml-2">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              )}
            </div>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className={state === 'collapsed' ? "w-14" : "w-64"}>
      <SidebarContent>
        {/* Usage Tracker for Free Users */}
        {state !== 'collapsed' && (
          <div className="p-4">
            <UsageTracker />
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Learning Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Learning Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learningItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Premium Upgrade */}
        {state !== 'collapsed' && (
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-medium">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-white/90 mb-3">
                Unlock all premium features and take your learning to the next level
              </p>
              <button 
                onClick={() => onTabChange('home')} // This will show premium features
                className="w-full bg-white/20 hover:bg-white/30 text-white text-xs py-2 px-3 rounded transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}