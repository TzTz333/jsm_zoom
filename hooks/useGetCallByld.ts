import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCallByld = (id: string | string[]) => {
    const [call,setCall] = useState<Call>()
    const [isCallLoading, setisCallLoading] = useState(true)

    //useStreamVideoClient,获取client
    const client = useStreamVideoClient();

    //useEffect,当client和id发生变化时，执行
    useEffect(() => {
        if(!client) return;

        //加载call
        const loadCall = async () => {
            //查询call，根据id，返回calls
            const {calls} = await client.queryCalls({
                filter_conditions: {
                    id
                }
            })
            //如果calls的长度大于0，就设置call为calls的第一个元素
            if(calls.length > 0) setCall(calls[0]);

            //设置isCallLoading为false,表示加载完成
            setisCallLoading(false);
        }
        //调用loadCall,加载call
        loadCall();
    //并且传入client和id
    },[client,id]);

    //返回call和isCallLoading
    return {call,isCallLoading};
}