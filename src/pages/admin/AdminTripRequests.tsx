import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Trash2, Loader2, Calendar, Users, DollarSign, MapPin, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface TripRequest {
  id: string;
  name: string;
  email: string;
  destinations: string[];
  arrival_date: string;
  departure_date: string;
  travelers: string;
  budget: string;
  interests: string[] | null;
  special_requests: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminTripRequests = () => {
  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TripRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trip_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch trip requests',
        variant: 'destructive',
      });
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('trip_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
      fetchRequests();
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    const { error } = await supabase
      .from('trip_requests')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete request',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Request deleted successfully',
      });
      fetchRequests();
    }
  };

  const viewDetails = (request: TripRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Trip Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to customer trip inquiries
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Requests ({requests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No trip requests yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Destinations</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {request.destinations.slice(0, 2).map((dest) => (
                            <Badge key={dest} variant="secondary" className="text-xs">
                              {dest}
                            </Badge>
                          ))}
                          {request.destinations.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{request.destinations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {format(new Date(request.arrival_date), 'MMM d')} -{' '}
                          {format(new Date(request.departure_date), 'MMM d, yyyy')}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={request.status}
                          onValueChange={(value) => updateStatus(request.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => viewDetails(request)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRequest(request.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Trip Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedRequest.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${selectedRequest.email}`}
                      className="font-medium text-primary flex items-center gap-1"
                    >
                      <Mail className="w-4 h-4" />
                      {selectedRequest.email}
                    </a>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Travel Dates
                    </p>
                    <p className="font-medium">
                      {format(new Date(selectedRequest.arrival_date), 'MMMM d, yyyy')} -{' '}
                      {format(new Date(selectedRequest.departure_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" /> Travelers
                    </p>
                    <p className="font-medium">{selectedRequest.travelers}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> Budget
                    </p>
                    <p className="font-medium">{selectedRequest.budget}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={statusColors[selectedRequest.status] || ''}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>

                {/* Destinations */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Destinations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.destinations.map((dest) => (
                      <Badge key={dest} variant="secondary">
                        {dest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                {selectedRequest.interests && selectedRequest.interests.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {selectedRequest.special_requests && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="text-sm bg-muted p-3 rounded-lg">
                      {selectedRequest.special_requests}
                    </p>
                  </div>
                )}

                {/* Submitted Date */}
                <div className="text-sm text-muted-foreground border-t pt-4">
                  Submitted on {format(new Date(selectedRequest.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTripRequests;
