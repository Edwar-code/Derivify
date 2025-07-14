// DerivConnectionCard.js
import { Button } from "@/components/ui/button";
import { useDeriv } from "@/path/to/DerivProvider";

export const DerivConnectionCard = () => {
  const { isConnected } = useDeriv();
  const APP_ID = 85288;

  const handleConnect = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&l=EN&scopes=read,trade`;
  };

  return (
    <div>
      <h2>Deriv Connection</h2>
      {isConnected ? (
        <p>You are connected to Deriv.</p>
      ) : (
        <Button onClick={handleConnect}>Connect to Deriv</Button>
      )}
    </div>
  );
};
