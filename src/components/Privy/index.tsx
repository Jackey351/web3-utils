import { PrivyProvider, usePrivy, useWallets, useLogin, useCreateWallet } from '@privy-io/react-auth';

function Login() {
  const { authenticated: privyAuthenticated } = usePrivy();
  const { wallets } = useWallets();
  const { login } = useLogin();
  const { createWallet } = useCreateWallet();

  const handleLogin = async ()=>{
    const embededWallet = wallets.find(
      wallet => wallet.walletClientType === "privy",
    );
    if (!embededWallet) {
      if (!privyAuthenticated) {
        login();
      } else {
        createWallet();
      }
      return;
    } else {
      const ethereumProvider = await embededWallet.getEthereumProvider();
      console.log(ethereumProvider);
    }
  }

  return <button onClick={handleLogin}>Log in</button>;
}

const Privy = function () {
  return (
    <PrivyProvider
      appId={'clpispdty00ycl80fpueukbhl'}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'github', 'apple', 'discord'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
      }}
    >
      <Login />
    </PrivyProvider>
  );
};

export default Privy;
