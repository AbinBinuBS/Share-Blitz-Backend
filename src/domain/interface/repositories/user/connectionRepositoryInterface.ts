
interface ConnectionRepositoryInterface {

    followUser(userId : string ,targetId:string) : Promise <any>,
    addFollowers(userId : string ,targetId:string) : Promise <any>,
    findConnectionsById(userId : string) : Promise <any>,
    removeFollowerById(userId : string,targetUserId:string) : Promise <any>,
    removeFollowingById(userId : string,targetId:string) : Promise <any>,
}

export default ConnectionRepositoryInterface 
