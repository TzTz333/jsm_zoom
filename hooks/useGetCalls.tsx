import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { use, useEffect, useState } from "react"

//这是一个自定义的hook，用于获取当前用户的通话记录，定义了一个calls数组，用于存储通话记录，
//一个loading状态，用于表示是否正在加载数据，一个client对象，用于调用Stream Video SDK的方法。
//最后通过useUser hook获取当前用户的信息。
export const useGetCalls = () => {
    const [calls, setCalls] = useState<Call[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const client = useStreamVideoClient();
    //{}解构赋值，只取user
    const { user } = useUser();


    useEffect(() => {
        const loadCalls = async () => {
            if(!client || !user?.id) return;

            setIsLoading(true);

            try {
                const {calls} = await client.queryCalls({
                    sort: [{field: 'starts_at', direction: -1}],
                    filter_conditions: {
                        starts_at: {$exists: true},
                        $or:[
                            {created_by_user_id: user.id},
                            {menubar:{$in: [user.id]}}
                        ]
                    }
                });

                setCalls(calls);
            } catch (error) {
                console.error(error);
            }finally{
                setIsLoading(false);
            }
        };

        //更新
        loadCalls();

    },[client,user?.id])

    const now = new Date();

    const endedCalls = calls?.filter(({state: {startsAt, endedAt}}: Call) => {
        return (startsAt && new Date(startsAt) < now || !!endedAt)
    })

    console.log('calls:', calls);

    const upcomingCalls = calls?.filter(({state:{startsAt}}:Call) => {
        return startsAt && new Date(startsAt) > now
    })

    console.log('upcomingCalls:', upcomingCalls);



    return{
        endedCalls,
        upcomingCalls,
        callRecordings: calls,
        isLoading,
    }
}