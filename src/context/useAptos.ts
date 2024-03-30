import { useMemo } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


// 自定义Hook
function useAptos() {
  const moduleAddress = "0xfbd0e6df8ee79607de7f4e421ff1bc6ae040bec42b7a54ba425c787292573b81";
  
  // 使用useMemo来确保Aptos实例不会在每次渲染时都重新创建
  const aptos = useMemo(() => {
    const aptosConfig = new AptosConfig({ network: Network.DEVNET });
    return new Aptos(aptosConfig);
  }, []); // 空依赖数组表示这个useMemo仅在组件挂载时执行一次

  return { aptos, moduleAddress };
}

export default useAptos;
