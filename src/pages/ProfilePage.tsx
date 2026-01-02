import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useConversions } from "@/hooks/useConversions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Settings, 
  History, 
  BarChart3, 
  FileText, 
  Image, 
  Download,
  Calendar,
  Clock,
  HardDrive,
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { conversions, loading: conversionsLoading } = useConversions();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
      setDisplayName(data.display_name || "");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("user_id", user.id);

      if (error) throw error;
      toast({ title: "Profile updated successfully" });
      fetchProfile();
    } catch (err) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Calculate usage statistics
  const stats = {
    totalConversions: conversions.length,
    completedConversions: conversions.filter(c => c.status === "completed").length,
    failedConversions: conversions.filter(c => c.status === "failed").length,
    totalFileSize: conversions.reduce((acc, c) => acc + c.file_size, 0),
    savedSpace: conversions.reduce((acc, c) => {
      if (c.output_size && c.output_size < c.file_size) {
        return acc + (c.file_size - c.output_size);
      }
      return acc;
    }, 0),
    toolUsage: conversions.reduce((acc, c) => {
      acc[c.tool_used] = (acc[c.tool_used] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-primary/20 text-primary"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case "processing":
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{profile?.display_name || "Welcome"}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Conversion History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Conversion History
                </CardTitle>
                <CardDescription>View all your past file conversions</CardDescription>
              </CardHeader>
              <CardContent>
                {conversionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : conversions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conversions yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/studio")}>
                      Start Converting
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversions.map((conversion) => (
                      <div 
                        key={conversion.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {conversion.tool_used.includes("image") || conversion.original_format.match(/png|jpg|jpeg|gif|webp/i) ? (
                            <Image className="h-5 w-5 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{conversion.original_filename}</p>
                          <p className="text-sm text-muted-foreground">
                            {conversion.original_format.toUpperCase()} → {conversion.output_format.toUpperCase()} • {formatBytes(conversion.file_size)}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(conversion.status)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(conversion.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Conversions</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalConversions}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    All time
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Success Rate</CardDescription>
                  <CardTitle className="text-3xl">
                    {stats.totalConversions > 0 
                      ? Math.round((stats.completedConversions / stats.totalConversions) * 100)
                      : 0}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    {stats.completedConversions} completed
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Files Processed</CardDescription>
                  <CardTitle className="text-3xl">{formatBytes(stats.totalFileSize)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    Total volume
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Space Saved</CardDescription>
                  <CardTitle className="text-3xl">{formatBytes(stats.savedSpace)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    From compression
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tool Usage</CardTitle>
                <CardDescription>Breakdown of tools you've used</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.toolUsage).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No usage data yet</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(stats.toolUsage).map(([tool, count]) => (
                      <div key={tool} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium capitalize">{tool.replace(/-/g, " ")}</div>
                        <div className="flex-1 h-3 rounded-full bg-border overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(count / stats.totalConversions) * 100}%` }}
                          />
                        </div>
                        <div className="w-12 text-right text-sm text-muted-foreground">{count}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email || ""} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={signOut}>
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
