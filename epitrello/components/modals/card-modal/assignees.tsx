"use client";

import { useState } from "react";
import { CardWithList } from "@/types";
import { Users, X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/lib/db";
import { addCardAssignee } from "@/actions/add-card-assignee";
import { removeCardAssignee } from "@/actions/remove-card-assignee";
import { useAction } from "@/hooks/use-actions";

interface AssigneesProps {
  data: CardWithList;
  members: Array<{ id: string; name: string; email: string; imageUrl: string | null }>;
}

export const Assignees = ({ data, members }: AssigneesProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { execute: executeAdd, isLoading: isAddLoading } = useAction(addCardAssignee, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      toast.success("Membre assigné");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeRemove, isLoading: isRemoveLoading } = useAction(removeCardAssignee, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      toast.success("Membre retiré");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const assignedUserIds = data.assignees.map((a) => a.userId);
  const availableMembers = members.filter((m) => !assignedUserIds.includes(m.id));

  const handleAdd = (userId: string) => {
    executeAdd({ cardId: data.id, userId });
  };

  const handleRemove = (userId: string) => {
    executeRemove({ cardId: data.id, userId });
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  const getMember = (userId: string) => {
    return members.find((m) => m.id === userId);
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <Users className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Membres</p>
        <div className="flex flex-wrap gap-2">
          {data.assignees.map((assignee) => {
            const member = getMember(assignee.userId);
            if (!member) return null;
            
            return (
              <div
                key={assignee.id}
                className="group relative flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 rounded-full pr-2 pl-1 py-1 transition"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.imageUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(member.name, member.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{member.name || member.email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => handleRemove(assignee.userId)}
                  disabled={isRemoveLoading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
            
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Membres de l'équipe</p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {availableMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Tous les membres sont déjà assignés
                    </p>
                  ) : (
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {availableMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => {
                            handleAdd(member.id);
                            setIsOpen(false);
                          }}
                          disabled={isAddLoading}
                          className="w-full flex items-center gap-2 p-2 hover:bg-neutral-100 rounded transition text-left disabled:opacity-50"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.imageUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {getInitials(member.name, member.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {member.name || member.email}
                            </p>
                            {member.name && (
                              <p className="text-xs text-muted-foreground truncate">
                                {member.email}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Assignees.Skeleton = function AssigneesSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-5 w-5 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-4 w-20 mb-2 bg-neutral-200" />
        <Skeleton className="h-8 w-32 bg-neutral-200" />
      </div>
    </div>
  );
};
