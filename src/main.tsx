import { Provider } from "@/components/ui/provider"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";
import { ProfileProvider } from "./providers/ProfileProvider.tsx"

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HUYvDB3aW",
  client_id: "22omuoadoaf3b2t1in154vjn9e",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid phone",
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <ProfileProvider >
        <Provider>
          <App />
        </Provider>
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>,
)
