import { ethers } from "ethers";

let provider;
let signer;

// 连接钱包
export async function connectWallet() { 
    if(typeof window.ethereum === 'undefined') {
        throw new Error('请安装MetaMask或其他以太坊钱包');
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
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