import { useMemo } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


// 自定义Hook
function useAptos() {
  const moduleAddress = "0x4ecce96fbd58903a8db2ce9548024459fdf2e70e5d8d83b93a32de1cf0f8d922";
  
  // 使用useMemo来确保Aptos实例不会在每次渲染时都重新创建
  const aptos = useMemo(() => {
    const aptosConfig = new AptosConfig({ network: Network.DEVNET });
    return new Aptos(aptosConfig);
  }, []); // 空依赖数组表示这个useMemo仅在组件挂载时执行一次

  return { aptos, moduleAddress };
}

export default useAptos;
