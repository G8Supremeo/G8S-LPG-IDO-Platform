# Vercel Environment Variables Setup - Supabase Integration

To make your wallet connection and token purchase functionality work on Vercel with Supabase backend, you need to set up the following environment variables in your Vercel dashboard:

## 🔴 **REQUIRED Environment Variables**

### **Wallet Connection**
1. **NEXT_PUBLIC_WC_PROJECT_ID**
   - Get this from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project and copy the Project ID
   - Example: `abc123def456ghi789`

### **Blockchain Configuration**
2. **NEXT_PUBLIC_RPC_URL_SEPOLIA**
   - Get a Sepolia RPC URL from providers like:
     - [Alchemy](https://www.alchemy.com/) (recommended)
     - [Infura](https://infura.io/)
     - [QuickNode](https://www.quicknode.com/)
   - Example: `https://eth-sepolia.g.alchemy.com/v2/your-api-key`

3. **NEXT_PUBLIC_G8S_TOKEN_ADDRESS**
   - The deployed G8S token contract address
   - Value: `0xCe28Eb32bbd8c66749b227A860beFcC12e612295`

4. **NEXT_PUBLIC_IDO_ADDRESS**
   - The deployed IDO contract address
   - Value: `0x182a1b31e2C57B44D6700eEBBD6733511b559782`

5. **NEXT_PUBLIC_PUSD_ADDRESS**
   - The PUSD token contract address
   - Value: `0xDd7639e3920426de6c59A1009C7ce2A9802d0920`

### **Backend API Configuration**
6. **NEXT_PUBLIC_API_URL**
   - Your Railway backend URL
   - Example: `https://your-backend.railway.app`

## 🟡 **OPTIONAL Environment Variables**

### **Supabase (if using direct frontend integration)**
7. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://your-project-id.supabase.co`

8. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous key
   - Get from Supabase dashboard

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with the following settings:
   - **Name**: The variable name (e.g., `NEXT_PUBLIC_WC_PROJECT_ID`)
   - **Value**: The actual value
   - **Environment**: Select all environments (Production, Preview, Development)
5. Click **Save**
6. Redeploy your application

## Important Notes

- All environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- After adding environment variables, you must redeploy your application
- Make sure your contract addresses are correct and deployed on Sepolia testnet
- The WalletConnect Project ID is free to obtain
- RPC URLs from Alchemy/Infura usually have free tiers with sufficient limits

## Testing

After setting up the environment variables:

1. Redeploy your application
2. Visit your Vercel URL
3. Go to the IDO page
4. Try connecting your wallet
5. Test the token purchase functionality

## Troubleshooting

If the wallet connection still doesn't work:

1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Ensure your contracts are deployed and accessible
4. Check that your RPC URL is working
5. Verify your WalletConnect Project ID is correct

## Security Note

Never commit your actual environment variables to your repository. Always use Vercel's environment variable system for production deployments.
