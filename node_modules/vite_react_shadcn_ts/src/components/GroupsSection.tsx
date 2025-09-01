import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Search,
  Plus,
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface Group {
  id: number | string;
  name: string;
  members: number;
  description: string;
  image: string;
  category: string;
  isJoined?: boolean;
  recentActivity?: string;
}

interface GroupsSectionProps {
  groups: Group[];
  onJoinGroup?: (groupId: number | string) => void;
  onCreateGroup?: () => void;
  isAuthenticated?: boolean;
}

const GroupsSection: React.FC<GroupsSectionProps> = ({ 
  groups, 
  onJoinGroup, 
  onCreateGroup,
  isAuthenticated = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [joinedGroups, setJoinedGroups] = useState<Set<number | string>>(new Set());
  const { toast } = useToast();

  const categories = [
    'all',
    'Solo Travel',
    'Budget Travel',
    'Photography',
    'Adventure',
    'Food & Culture',
    'Family Travel'
  ];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinGroup = (groupId: number | string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join groups.",
        variant: "destructive"
      });
      return;
    }

    const isCurrentlyJoined = joinedGroups.has(groupId);
    
    if (isCurrentlyJoined) {
      setJoinedGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
      toast({
        title: "Left Group",
        description: "You have left the group.",
      });
    } else {
      setJoinedGroups(prev => new Set(prev).add(groupId));
      toast({
        title: "Joined Group!",
        description: "You have successfully joined the group.",
      });
    }

    onJoinGroup?.(groupId);
  };

  const handleCreateGroup = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create groups.",
        variant: "destructive"
      });
      return;
    }

    onCreateGroup?.();
    toast({
      title: "Create Group",
      description: "Group creation feature coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search groups..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateGroup} className="bg-gradient-hero hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            {searchTerm ? 'No groups found matching your search' : 'No groups available'}
          </p>
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const isJoined = joinedGroups.has(group.id);
            
            return (
              <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {group.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {group.name}
                    </h3>
                    {group.recentActivity && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Active
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {group.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {typeof group.members === 'number' 
                        ? group.members.toLocaleString() 
                        : group.members
                      } members
                    </div>
                    
                    <Button
                      size="sm"
                      variant={isJoined ? 'outline' : 'default'}
                      onClick={() => handleJoinGroup(group.id)}
                      className={isJoined ? 'border-green-500 text-green-500 hover:bg-green-50' : ''}
                    >
                      {isJoined ? 'Joined' : 'Join Group'}
                    </Button>
                  </div>
                  
                  {group.recentActivity && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        Recent: {group.recentActivity}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {filteredGroups.length > 0 && (
        <div className="text-center pt-6">
          <Button variant="outline">
            Load More Groups
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupsSection;