import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leak } from "@/types/leak";

interface LeakTableProps {
  leaks: Leak[];
  onMarkFixed: (id: string) => void;
}

const getSeverityVariant = (severity: string): "default" | "destructive" | "secondary" => {
  switch (severity) {
    case "High":
      return "destructive";
    case "Medium":
      return "default";
    case "Low":
      return "secondary";
    default:
      return "default";
  }
};

const LeakTable = ({ leaks, onMarkFixed }: LeakTableProps) => {
  const [selectedLeak, setSelectedLeak] = useState<Leak | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredLeaks = leaks.filter((leak) =>
    severityFilter === "all" ? true : leak.severity === severityFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by severity:</span>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredLeaks.length} of {leaks.length} reports
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No leak reports found
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaks.map((leak) => (
                <TableRow key={leak.id}>
                  <TableCell className="font-medium">
                    {leak.locationDescription}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(leak.severity)}>
                      {leak.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{leak.reporterName}</TableCell>
                  <TableCell>
                    {new Date(leak.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLeak(leak)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onMarkFixed(leak.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Fixed
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLeak} onOpenChange={() => setSelectedLeak(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leak Report Details</DialogTitle>
            <DialogDescription>
              Reported on {selectedLeak && new Date(selectedLeak.timestamp).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedLeak && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={getSeverityVariant(selectedLeak.severity)} className="text-base px-3 py-1">
                  {selectedLeak.severity} Severity
                </Badge>
              </div>

              {selectedLeak.imageUrl && (
                <img
                  src={selectedLeak.imageUrl}
                  alt="Leak evidence"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div className="grid gap-3">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Location</h4>
                  <p>{selectedLeak.locationDescription}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeak.latitude.toFixed(6)}, {selectedLeak.longitude.toFixed(6)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Description</h4>
                  <p>{selectedLeak.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Reporter Information</h4>
                  <p><strong>Name:</strong> {selectedLeak.reporterName}</p>
                  <p><strong>Contact:</strong> {selectedLeak.reporterContact}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    onMarkFixed(selectedLeak.id);
                    setSelectedLeak(null);
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Fixed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedLeak(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeakTable;
