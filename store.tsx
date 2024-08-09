import { useEffect } from "react";
import { create } from "zustand";
import { EVMWallet } from "@catalogfi/wallets";
import { BrowserProvider } from "ethers";
import { GardenJS } from "@gardenfi/core";
import { Orderbook, Chains } from "@gardenfi/orderbook";
import {
  BitcoinNetwork,
  BitcoinOTA,
  BitcoinProvider,
} from "@catalogfi/wallets";

type EvmWalletState = {
  metaMaskIsConnected: boolean;
  evmProvider: BrowserProvider | null;
};

type EvmWalletAction = {
  connectMetaMask: () => Promise<void>;
};

const networkConfig = {
  chainId: "0x7A69",
  chainName: "ethereum localnet",
  rpcUrls: ["http://localhost:8545"],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
};

const useMetaMaskStore = create<EvmWalletState & EvmWalletAction>((set) => ({
  metaMaskIsConnected: false,
  evmProvider: null,
  connectMetaMask: async () => {
    if (window.ethereum !== null) {
      let provider = new BrowserProvider(window.ethereum);
      let network = await provider.getNetwork();
      if (network.chainId !== 31337n) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [networkConfig],
        });
        provider = new BrowserProvider(window.ethereum);
      }
      set(() => ({
        evmProvider: provider,
        metaMaskIsConnected: true,
      }));
    } else {
      throw new Error("MetaMask not Found");
    }
  },
}));

type GardenStore = {
  garden: GardenJS | null;
  bitcoin: BitcoinOTA | null;
  setGarden: (garden: GardenJS, bitcoin: BitcoinOTA) => void;
};

const gardenStore = create<GardenStore>((set) => ({
  garden: null,
  bitcoin: null,
  setGarden: (garden: GardenJS, bitcoin: BitcoinOTA) => {
    set(() => ({
      garden,
      bitcoin,
    }));
  },
}));

type SignStore = {
  isMMPopupOpen: boolean;
  isSigned: boolean;
  setIsMMPopupOpen: (isMMPopupOpen: boolean) => void;
  setIsSigned: (isSigned: boolean) => void;
};

const useSignStore = create<SignStore>((set) => ({
  isMMPopupOpen: false,
  isSigned: false,
  setIsMMPopupOpen: (isMMPopupOpen: boolean) => {
    set(() => {
      return { isMMPopupOpen };
    });
  },
  setIsSigned: (isSigned: boolean) => {
    set(() => {
      return { isSigned };
    });
  },
}));

const useGarden = () => ({
  garden: gardenStore((state) => state.garden),
  bitcoin: gardenStore((state) => state.bitcoin),
});

/* Only to be used once at the root level*/
const useGardenSetup = () => {
  const { evmProvider } = useMetaMaskStore();
  const { setGarden } = gardenStore();

  useEffect(() => {
    (async () => {
      if (!evmProvider) return;
      const signer = await evmProvider.getSigner();

      const bitcoinProvider = new BitcoinProvider(
        BitcoinNetwork.Regtest,
        "http://localhost:30000"
      );

      const orderbook = await Orderbook.init({
        url: "http://localhost:8080",
        signer: signer,
        opts: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          domain: (window as any).location.host,
          store: localStorage,
        },
      });

      const wallets = {
        [Chains.bitcoin_regtest]: new BitcoinOTA(bitcoinProvider, signer),
        [Chains.ethereum_localnet]: new EVMWallet(signer),
      };

      const garden = new GardenJS(orderbook, wallets);

      setGarden(garden, wallets[Chains.bitcoin_regtest]);
    })();
  }, [evmProvider, setGarden]);
};

export { useMetaMaskStore, useGarden, useGardenSetup, useSignStore };
