import { Provider } from "@/components/ui/provider"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HUYvDB3aW",
  client_id: "22omuoadoaf3b2t1in154vjn9e",
  redirect_uri: "https://main.d28mj8dz6wqkv9.amplifyapp.com/dashbord",
  response_type: "code",
  scope: "email openid phone",
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <Provider>
        <App />
      </Provider>
    </AuthProvider>
  </StrictMode>,
)
