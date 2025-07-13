import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

export function InstallAppCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Smartphone /> Install Derivify App
                </CardTitle>
                <CardDescription>
                    For the best experience, add this site to your home screen.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    You can install this web application on your device for easy access. Look for the <span className="font-semibold">"Add to Home Screen"</span> or <span className="font-semibold">"Install App"</span> button in your browser's menu.
                </p>
            </CardContent>
        </Card>
    );
}