"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { markNotificationRead, markAllNotificationsRead } from "@/actions/mark-notification-read";
import { acceptInvitation, declineInvitation } from "@/actions/manage-invitation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  cardId: string | null;
  boardId: string | null;
  invitationId: string | null;
  createdAt: string;
}

export const NotificationBell = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: notifications, refetch } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => fetcher("/api/notifications"),
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationRead(notificationId);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsRead();
    toast.success("Toutes les notifications ont été marquées comme lues");
    refetch();
  };

  const handleNotificationClick = (notification: Notification) => {
    // Ne pas naviguer si c'est une invitation (elle a des boutons d'action)
    if (notification.type === "organization_invite") {
      return;
    }

    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    // Naviguer vers la carte ou le board si disponible
    if (notification.cardId && notification.boardId) {
      setIsOpen(false);
      router.push(`/board/${notification.boardId}`);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      // Optimistic update - fermer la popover immédiatement
      setIsOpen(false);
      toast.loading("Acceptation de l'invitation...");
      
      const result = await acceptInvitation(invitationId);
      
      toast.dismiss();
      
      if (result.error) {
        toast.error(result.error);
        refetch();
        return;
      }
      
      toast.success("Invitation acceptée !");
      
      if (result.organizationId) {
        // Navigation immédiate
        router.push(`/organization/${result.organizationId}`);
      }
      
      refetch();
    } catch (error) {
      toast.dismiss();
      toast.error("Une erreur est survenue");
      refetch();
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      toast.loading("Refus de l'invitation...");
      
      const result = await declineInvitation(invitationId);
      
      toast.dismiss();
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success("Invitation refusée");
      refetch();
    } catch (error) {
      toast.dismiss();
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[400px]">
          {!notifications || notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  } ${notification.type !== "organization_invite" ? "hover:bg-accent cursor-pointer" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                      
                      {/* Boutons d'action pour les invitations */}
                      {notification.type === "organization_invite" && notification.invitationId && (
                        <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptInvitation(notification.invitationId!)}
                            className="flex-1"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclineInvitation(notification.invitationId!)}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </div>
                      )}
                    </div>
                    {!notification.isRead && notification.type !== "organization_invite" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
