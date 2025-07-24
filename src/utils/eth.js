import { ethers } from 'ethers';

let provider;
let signer;

// 当前钱包类型：'metamask' | 'walletconnect'
let walletType = null

// 连接钱包
export async function connectWallet(type = 'metamask') { 
    walletType = type;

    if (type === 'metamask') {
        if(typeof window.ethereum === 'undefined') {
            throw new Error('请安装MetaMask或其他以太坊钱包');
        }
        // ethers v6中用于Web钱包的provider类型，包装了window.ethereum对象，提供访问区块链的能力（如查询区块，交易等）
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
    }else if (type === 'walletconnect') {
        alert('WalletConnect功能尚未实现');
    }
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    localStorage.setItem('currentAddress', address);
    localStorage.setItem('walletType', type);

    return signer.getAddress();
}

// 获取当前账户地址
export async function getCurrentAddress() {
    if (!signer) {
        return null;
    }
    return signer.getAddress();
}

export function getProvider() {
    return provider;
}

export function getSigner() {
    return signer;
}

export async function disconnectWallet() {
  // WalletConnect 需要主动关闭
  if (walletType === 'walletconnect') {
    alert('WalletConnect功能尚未实现');
    return;
  }

  provider = null
  signer = null
  walletType = null
  localStorage.removeItem('wallet_address')
  localStorage.removeItem('wallet_type')
}