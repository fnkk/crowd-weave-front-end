import { useMemo } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


// 自定义Hook
function useAptos() {
  const moduleAddress = "0xee9f3fe9e95aedae0a7b424b5ca82159440d14d5285eb1f3df2e4cc9a3d0eb51";
  
  // 使用useMemo来确保Aptos实例不会在每次渲染时都重新创建
  const aptos = useMemo(() => {
    const aptosConfig = new AptosConfig({ network: Network.DEVNET });
    return new Aptos(aptosConfig);
  }, []); // 空依赖数组表示这个useMemo仅在组件挂载时执行一次

  return { aptos, moduleAddress };
}

export default useAptos;
