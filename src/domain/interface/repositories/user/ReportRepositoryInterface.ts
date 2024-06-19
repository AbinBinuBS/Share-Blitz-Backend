
interface ReportRepositoryInterface {

    getAllReportedPosts() : Promise <any>,
    changeActionStatus(reportId : string) : Promise <any>,
    getReportsByPostId(postId:string) : Promise <any>,
}

export default ReportRepositoryInterface 
